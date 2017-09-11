'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var OrderItem = sequelize.define('OrderItems', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        OrderId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        ProductId: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        InventoryId: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        sku: {
            type:DataTypes.STRING,
            allowNull: false
        },              
        quantity: {
            allowNull: false,
            type: DataTypes.FLOAT,
            validate: {min: 1, max: 10},  
            defaultValue:0
        },
        unitprice: {
            allowNull: false,
            type: DataTypes.FLOAT,
            defaultValue:0
        },
        discount:{
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue:0
        },
        discountcode:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:0
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
        instructions:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue:'none'
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
OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Orders);
    OrderItem.belongsTo(models.Products);
    OrderItem.belongsTo(models.Inventories);
    
}



return OrderItem
}
