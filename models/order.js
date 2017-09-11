'use strict';
var moment = require('moment');
var crypto = require('crypto');
module.exports = function(sequelize, DataTypes) {
var Order = sequelize.define('Orders', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        CustomerId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        TrackingNumber:{
            allowNull: false,
            type: DataTypes.TEXT,
            defaultValue:function(){
                return crypto.randomBytes(6).toString('hex');
            }
        },
        externalOrderId: {
            type:DataTypes.TEXT,
            allowNull: true
        },      
        totalprice: {
            allowNull: false,
            type: DataTypes.FLOAT,
            defaultValue:0
        },
        totaldiscount:{
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue:0
        },
        discountcode:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:'none'
        },
        tax:{
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue:0.18
        },
        shippingprice: {
            allowNull: false,
            type: DataTypes.FLOAT,
            defaultValue:0
        },  
        status:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'new'
        },  
        paymentmethod:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'cc'
        },  
        iscancelled:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isconfirmed:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }, 
        isshipped:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }, 
        isreceived:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isreturned:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },  
        isdeleted:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: function(){
                return moment().format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: function(){
                return moment().format('YYYY-MM-DD');
            }        
        }               
    }   
);

// /* Relationship */

Order.associate = (models) => {
    Order.hasMany(models.OrderItems);
    Order.hasOne(models.OrderAddressBooks);
    Order.hasMany(models.OrderShipments);
    Order.belongsTo(models.Customers);
}


// Product.query = (sql) => {
//     return new Promise(function(resolve,reject){
//         sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then((data) => {
//             resolve(data);
//         }).catch((err)=>{
//             reject(err);
//         });
//     });    
// }

// Order.addOrderItem = (orderitem) => {
//     return new Promise(function(resolve,reject){
//         var sql= 'INSERT INTO "OrderItems" ("id","OrderId","ProductId","InventoryId","sku","quantity","unitprice","discount","discountcode","shippingprice","status","instructions","iscancelled","isconfirmed","isshipped","isreceived","isreturned","isdeleted","createdAt","updatedAt") VALUES (DEFAULT,';

//         sequelize.query(sql, {type: sequelize.QueryTypes.INSERT}).then((data) => {
//             resolve(data);
//         }).catch((err)=>{
//             reject(err);
//         });
//     });    
// }

// /* Relationship */
// Order.hasMany(sequelize.models.OrderItems);
// Order.hasMany(sequelize.models.OrderAddressBooks);

// /* Class Methods */
// Order.get = function(id){
//     var where = {
//        isdeleted: false 
//     }
//     if(id){
//         where = {
//             id: id 
//         }
//     }
//     return this.findAll({
//         include:[
//         {
//             model:sequelize.models.OrderItems
//         }
//         ],
//         where:where
//     });
// };

return Order
}

