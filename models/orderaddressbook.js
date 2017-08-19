'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var OrderAddressBook = sequelize.define('OrderAddressBooks', 
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
        CustomerId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        type: {
            allowNull: false,
            type: DataTypes.STRING
        },
        isshippingaddress:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },      
        isbillingaddress:{
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

return OrderAddressBook
}