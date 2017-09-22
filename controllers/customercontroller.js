'use strict';
var _ = require("lodash");

var {Customers,CustomerAddressBooks, Orders, OrderItems, OrderAddressBooks} = require('../models');

var CustomerController = {
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
    create:(values)=>{
        return new Promise((resolve,reject)=>{

            var options={
                fname:undefined,
                lname:undefined,
                email:undefined,
                phonenumber:undefined,
                addressline1:undefined,
                addressline2:undefined,
                state:undefined,
                city:undefined,
                country:'IN',
                postalcode:undefined,
                hashcode:'password123',
                name:undefined
            };
            _.map(values,(value,key)=>{
                switch(key){
                    case 'fname':options['fname']=value;break;
                    case 'lname':options['lname']=value;break;
                    case 'eaddr':options['email']=value;break;
                    case 'hashcode':'password123';break;
                    case 'pno':options['phonenumber']=value;break;
                    case 'adrl1':options['addressline1']=value;break;
                    case 'adrl2':options['addressline2']=value;break;
                    case 'adrcty':options['city']=value;break;
                    case 'adrst':options['state']=value;break;
                    case 'adrpst':options['postalcode']=value;break;
                }
            });

            if(options['fname'] && options['lname']){
                options['name'] = options['fname'] +','+options['lname'];
                
            }

            Customers.create(options).then((customer)=>{
                customer.createCustomerAddressBook(options).then((caddr) =>{
                    console.log("custoemr addr added");
                    resolve({customer:customer,customeraddressbooks:caddr});
                })
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })

            /*
            case 'fname': oitems['fname'] = parseFloat($(element).val()) || 'unknown'; break;
            case 'lname': oitems['lname'] = $(element).val() || 'unknown'; break;
            case 'eddr': oitems['eddr'] = $(element).val() || 'unknown'; break;
            case 'pno': oitems['pno'] = $(element).val() || 'unknown'; break;
            case 'adrl1': oitems['adrl1'] = parseFloat($(element).val()) || 'unknown'; break;
            case 'adrl2': oitems['adrl2'] = $(element).val() || 'unknown'; break;
            case 'adrcty': oitems['adrcty'] = $(element).val() || 'unknown'; break;
            case 'adrst': oitems['adrst'] = $(element).val() || 'none'; break;
            case 'paytype': oitems['paytype'] = $(element).val() || 'none'; break;
            
            name,
            email,
            phonenumber,
            hashcode,

            */
        })
    },
    register:(values)=>{
        return new Promise((resolve,reject)=>{
            var options={
                fname:undefined,
                lname:undefined,
                email:undefined,
                phonenumber:undefined,
                addressline1:undefined,
                addressline2:undefined,
                state:undefined,
                city:undefined,
                country:'IN',
                postalcode:undefined,
                hashcode:'password123',
                name:undefined
            };
            _.map(values,(value,key)=>{
                switch(key){
                    case 'fname':options['fname']=value;break;
                    case 'lname':options['lname']=value;break;
                    case 'eaddr':options['email']=value;break;
                    case 'paswd':options['hashcode']=value;break;
                    case 'pno':options['phonenumber']=value;break;
                    case 'adrl1':options['addressline1']=value;break;
                    case 'adrl2':options['addressline2']=value;break;
                    case 'adrcty':options['city']=value;break;
                    case 'adrst':options['state']=value;break;
                    case 'adrpst':options['postalcode']=value;break;
                }
            });

            if(options['fname'] && options['lname']){
                options['name'] = options['fname'] +','+options['lname'];
                
            }

            Customers.create(options).then((customer)=>{
                resolve(customer);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            }) 
        })       
    },
    findOne: (values) => {
        return new Promise((resolve,reject)=>{
            var options={
                email:undefined,
                hashcode:undefined,
                isdeleted:false
            };
            _.map(values,(value,key)=>{
                switch(key){
                    case 'eaddr':options['email']=value.toLowerCase();break;
                    case 'paswd':options['hashcode']=value;break;
                }
            });

            Customers.findOne({
                where:options,
                attributes:["id","customertype"]
            }).then((customer)=>{
                if(customer){
                    resolve(customer);
                }else{
                    reject("Customer Not Found");
                }
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })            
        })
    },
    getCustomers:(options) => {
        return new Promise((resolve,reject) => {
            Customers.findAll({
                where:{
                    isdeleted: false,
                    customertype:{
                        $in: ['c','g']
                    }
                },
                offset:options.offset,
                limit:100
            }).then((customers) => {
                resolve(customers);
            }).catch((err) => {
                reject("customers not found");
            })
        });
    },    
    getProfile:(id) => {
        return new Promise((resolve,reject)=>{
            Customers.findOne({
                where:{
                    id: id
                }
            }).then((customer)=>{
                if(customer){
                    resolve(customer);
                }else{
                    reject("Customer Not Found");
                }
            }).catch((err)=>{
                console.log(err);
                reject(err);
            }) 
        })       
    },
    getAddressBook: (id) => {
        return new Promise((resolve,reject)=>{
            CustomerAddressBooks.findAll({
                where:{
                    CustomerId: id
                }
            }).then((customeraddressbooks)=>{
                resolve(customeraddressbooks);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            }) 
        })       
    },
    getOrder: (id) => {
        return new Promise((resolve,reject)=>{
            Orders.findAll({
                where:{
                    CustomerId: id
                }
            }).then((orders)=>{
                resolve(orders);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })  
        })      
    },    
    addAddressBook:(id,values) =>{
        return new Promise((resolve,reject)=>{
            var options={
                name:undefined,
                phonenumber:undefined,
                addressline1:undefined,
                addressline2:undefined,
                state:undefined,
                city:undefined,
                country:'IN',
                postalcode:undefined,
            };
            _.map(values,(value,key)=>{
                switch(key){
                    case 'adrnm':options['name']=value;break;
                    case 'adrl1':options['addressline1']=value;break;
                    case 'adrl2':options['addressline2']=value;break;
                    case 'adrcity':options['city']=value;break;
                    case 'adrst':options['state']=value;break;
                    case 'adrpst':options['postalcode']=value;break;
                    case 'pno':options['phonenumber']=value;break;
                }
            });

            Customers.findOne({
                where:{
                    id:id,
                    isdeleted:false
                }
            }).then((customer)=>{
                customer.createCustomerAddressBook(options).then((ab)=>{
                    resolve(ab);
                }).catch((err)=>{
                    reject(err);
                })
            }).catch((err)=>{
                console.log(err);
                reject(err);
            }) 
        })           
    },
    checkout:(values)=>{
        return new Promise((resolve,reject)=>{
            var options={
                fname:undefined,
                lname:undefined,
                email:undefined,
                phonenumber:undefined,
                addressline1:undefined,
                addressline2:undefined,
                state:undefined,
                city:undefined,
                country:'IN',
                postalcode:undefined,
                hashcode:'password123',
                name:undefined
            };
            var hasaddressbookid = undefined;
            _.map(values,(value,key)=>{
                switch(key){
                    case 'fname':options['fname']=value;break;
                    case 'lname':options['lname']=value;break;
                    case 'eaddr':options['email']=value;break;
                    case 'paswd':options['hashcode']=value;break;
                    case 'pno':options['phonenumber']=value;break;
                    case 'adrl1':options['addressline1']=value;break;
                    case 'adrl2':options['addressline2']=value;break;
                    case 'adrcty':options['city']=value;break;
                    case 'adrst':options['state']=value;break;
                    case 'adrpst':options['postalcode']=value;break;
                    case 'name':options['name']=value;break;
                    case 'adbkid': hasaddressbookid=value;
                }
            });

            if(options['fname'] && options['lname']){
                options['name'] = options['fname'] +','+options['lname'];
                
            }                
        
            Customers.findOne({
                where:{
                    email:values.eaddr
                }
            }).then((cst)=>{
                if(!cst){
                    Customers.create(options).then((customer)=>{
                        if (options['name'] == undefined){
                            options['name']='order';
                        }                    
                        customer.createCustomerAddressBook(options).then((ab)=>{
                            resolve({customer:customer,customeraddressbooks:ab});
                        }).catch((err)=>{
                            reject(err);
                        })
                    })
                }else{
                    if(cst.isdeleted){
                        cst.update({isdeleted:false});
                    }
                    if(hasaddressbookid == undefined){
                        if (options['name'] == undefined){
                            options['name']='order';
                        }                    
                        cst.createCustomerAddressBook(options).then((ab)=>{
                            resolve({customer:cst,customeraddressbooks:ab});
                        }).catch((err)=>{
                            reject(err);
                        })
                    }else{
                        CustomerAddressBooks.findOne({where:{id: hasaddressbookid, CustomerId: cst.id, isdeleted: false}}).then((ab)=>{
                            if(!ab){
                                if (options['name'] == undefined){
                                    options['name']='order';
                                }                    
                                customer.createCustomerAddressBook(options).then((ab)=>{
                                    resolve({customer:customer,customeraddressbooks:ab});
                                }).catch((err)=>{
                                    reject(err);
                                })
                            }else{
                                resolve({customer:cst,customeraddressbooks:ab});
                            }
                        })
                    }
                }
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })            
        })
    },
    updatePassword: (id,values) =>{
        return new Promise((resolve,reject)=>{
            Customers.findOne({
                where:{
                    id:id,
                    hashcode:values.passwd
                }
            }).then((customer)=>{
                customer.update({hashcode:values.newpasswd}).then((cst)=>{
                    resolve(cst);
                }).catch((err)=>{
                    reject(err);
                })
            }).catch((err)=>{
                reject(err);
            })  
        })    
    }
}

module.exports = CustomerController;