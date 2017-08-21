'use strict';
var _ = require("lodash");

var {Customers,CustomerAddressBooks} = require('../models');

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
    }
}

module.exports = CustomerController;