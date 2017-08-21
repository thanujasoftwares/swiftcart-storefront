'use strict';
var _ = require("lodash");

var {Orders,OrderItems, OrderAddressBooks} = require('../models');

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
    getId:(id) => {
        return new Promise((resolve,reject) => {
            if(id){
                reject("order id not provided");
            }
            Orders.findAll({
                include:[{
                    model:OrderItems
                }],
                where:{
                    id: id
                }
            }).then((orders) => {
                resolve(orders);
            }).catch((err) => {
                reject("order not found");
            })
        });
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
                'isreceived':true,
                'token':token
            }).then((order) => {
                var oitems=[]
                _.map(orders.items,(orderitem,index)=>{
                    orderitem['ProductId']=orderitem.pid || undefined;
                    orderitem['InventoryId']=orderitem.invid || undefined;
                    orderitem['unitprice']=orderitem.price || undefined;
                    orderitem['quantity']=orderitem.qty || 0;                    
                    oitems.push(OrderController.addOrderItem(order,orderitem));
                });

                oitems.push(OrderController.addOrderAddress(order,{
                    'CustomerId':customer.id,
                    'CustomerAddressBookId':customeraddressbook.id,
                    'type':'both',
                    'isshippingaddress':true,
                    'isbillingaddress':true
                }));

                Promise.all(oitems).then((orditms)=>{
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
    }
}

module.exports = OrderController;