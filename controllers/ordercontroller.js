'use strict';
var _ = require("lodash");

var {Orders,OrderItems, OrderAddressBooks, Products, ProductImages, CustomerAddressBooks, OrderShipments} = require('../models');
var redis = require('redis');
var rc = new redis.createClient();
const confirmOrderPublisher = require("redis").createClient();

var OrderController = {
    _mapValuesToOrder:(values) =>{
        cols={
            'totalprice':'',
            'totaldiscount':0,
            'discountcode':'',
            'isreceived':true
        }



        _.map(values,(value,key)=>{
            switch(key.toLowercase()){
                case 'discount':cols.discount=value;break;
            }
        })        
    },
    _mapValuesToOrderItems:(values) =>{
        cols={
            'ProductId':'',
            'sku':'',
            'quantity':0,
            'unitprice':0,
            'discount':0
        };
        _.map(values,(value,key)=>{
            switch(key.toLowercase()){
                case 'productid':cols.ProductId=value;break;
                case 'sku':cols.ProductId=value;break;
                case 'quantity':cols.quantity=value;break;
                case 'unitprice':cols.unitprice=value;break;
                case 'discount':cols.discount=value;break;
            }
        })
    },  
    _parseAndClean:(p) => {
        var isdeleted = false;
         _.map(p,(v,k)=>{
            switch(k){
                case 'isdeleted':
                    if(v){
                        isdeleted=true;
                    }
                    delete p[k]
                    
                break;
                case 'createdAt':
                case 'updatedAt':
                    delete p[k]
                default:
                    if(_.isObject(v)){
                        p[k] = OrderController._parseAndClean(v);
                    }
            }
        });
        if(isdeleted){
            return null;
        }else{
            return p;
        }
    },   
    getJSONDocument:(order) => {
        var obj = JSON.parse(JSON.stringify(order));
        return JSON.stringify(OrderController._parseAndClean(obj));  
    },        
    addOrderItem:(order,orderitem)=>{
        return new Promise((resolve,reject)=>{
            order.createOrderItem(orderitem).then((orderitem)=>{
                resolve(orderitem);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    },
    addOrderAddress:(order,address)=>{
        return new Promise((resolve,reject)=>{
            order.createOrderAddressBook(address).then((address)=>{
                resolve(address);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    },  
    updateInventory:(orderitem) =>{
        return new Promise((resolve,reject)=>{
            rc.get("inv:"+orderitem.invid,function(err,value){
                if(value==null || value <=0){
                    reject("Inventory Error");
                }else{
                    rc.set("inv:"+orderitem.invid, parseInt(value)-parseInt(orderitem.qty));
                    resolve("Inventory Updated");
                }
            });
         });
    },
    create:(customer,customeraddressbook,orders)=>{
        return new Promise((resolve,reject)=>{
            var totalprice=0;
            var totaldiscount = 0;
            var discountcode = 'none';
            _.map(orders.items,(orderitem,index)=>{
                totalprice += orderitem.price*orderitem.qty;
            });
            var token=''
            require('crypto').randomBytes(32, function(err, buffer) {
                token = buffer.toString('hex');
            });
            Orders.create({
                'CustomerId':customer.id,
                'totalprice':totalprice,
                'totaldiscount':totaldiscount,
                'discountcode':discountcode,
                'isreceived':false,
                'token':token
            }).then((order) => {
                var oitems=[]
                _.map(orders.items,(orderitem,index)=>{
                    orderitem['ProductId']=orderitem.pid || undefined;
                    orderitem['InventoryId']=orderitem.invid || undefined;
                    orderitem['unitprice']=orderitem.price || undefined;
                    orderitem['quantity']=orderitem.qty || 0;                    
                    oitems.push(OrderController.addOrderItem(order,orderitem));
                    oitems.push(OrderController.updateInventory(orderitem));
                });

                oitems.push(OrderController.addOrderAddress(order,{
                    'CustomerId':customer.id,
                    'CustomerAddressBookId':customeraddressbook.id,
                    'type':'both',
                    'isshippingaddress':true,
                    'isbillingaddress':true
                }));

                Promise.all(oitems).then((orditms)=>{
                    confirmOrderPublisher.publish("send:orderconfirm",order.id+'-'+order.CustomerId+'-'+order.TrackingNumber+'-'+customer.email);
                    resolve({
                        order:order,
                        customer:customer,
                        customeraddressbook:customeraddressbook
                    });
                }).catch((err)=>{
                    order.destroy();
                    customeraddressbook.destroy();
                    customer.destroy();
                    console.log(err);
                    reject(err);
                });
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    },
    getOrder: (customerid,id) => {
        return new Promise((resolve,reject)=>{
            Orders.findOne({
                include:[
                    {
                        model: OrderItems,
                        include:{
                            model: Products,
                            include:{
                                model:ProductImages
                            }
                        }
                    },
                    {
                        model: OrderAddressBooks,
                        include:{
                            model: CustomerAddressBooks,
                        }
                    },
                    {
                        model: OrderShipments
                    }                    
                ],
                where:{
                    id: id,
                    CustomerId: customerid
                }
            }).then((orders)=>{
                resolve(JSON.parse(OrderController.getJSONDocument(orders)));
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })  
        })      
    }, 
    getOrders: (options) => {
        return new Promise((resolve,reject)=>{
            Orders.findAll({
                where:{
                    isdeleted: false,
                },
                offset:(options.offset || 0)*100, 
                limit: 100,
                order:[
                    ['id','DESC']
                ]
            }).then((orders)=>{
                resolve(orders);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })  
        })      
    },  
    update: (id,trackingnumber,options) =>{
        return new Promise((resolve,reject) => {
            Orders.update(options,{
                where:{
                    id:id,
                    TrackingNumber:trackingnumber
                }
            }).then((order)=>{
                if(order){
                    resolve(order);
                }else{
                    console.log(err);
                    reject("Order is not updated");
                }
            }).catch((err)=>{
                console.log(err);
                reject("Order is not updated");
            })
        })
    }, 


    addShippingLabel:(id,options) => {
        return new Promise((resolve,reject) => {
            Orders.findOne({
                where:{
                    id:id,
                    isdeleted:false,
                    iscancelled:false,
                    isreceived:false
                }
            }).then((order)=>{
                if(order){
                    order.createOrderShipment({
                        trackingnumber:options.trackno,
                        shipdate:options.sdate,
                        carrier:options.crr,
                        shippingprice:options.prc
                    }).then((shipment)=>{
                        resolve(shipment);
                    }).catch((err)=>{
                        console.log(err);
                        reject("Shipment is not added");
                    })
                }else{
                    reject("Order not found")
                }
            }).catch((err)=>{
                console.log(err);
                reject("Errored while fetching order");
            })
        })
    },
    deleteShippingLabel:(id,options) => {
        return new Promise((resolve,reject) => {
            OrderShipments.update(
            {
                isdeleted:true
            },
            {
                where:{
                    OrderId:id,
                    id:options.sid,
                    isdeleted:false,
                    iscancelled:false,
                    isreceived:false
                }
            }).then((shipment)=>{
                if(shipment){
                    resolve(shipment);
                }else{
                    reject("Shipment not found")
                }
            }).catch((err)=>{
                console.log(err);
                reject("Errored while fetching Shipment");
            })
        })
    }
    
}

module.exports = OrderController;