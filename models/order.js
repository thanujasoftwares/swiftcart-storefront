'use strict';
var moment = require('moment');
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
            defaultValue:0
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
            defaultValue: false
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
    Order.hasMany(models.OrderAddressBooks);
}

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

