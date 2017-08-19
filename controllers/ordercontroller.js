'use strict';
var _ = require("lodash");

var {Orders,OrderItems} = require('../models');

var OrderController = {
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
    }
}

module.exports = OrderController;