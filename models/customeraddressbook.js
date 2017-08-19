'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var CustomerAddressBook = sequelize.define('CustomerAddressBooks', 
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
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        addressline1: {
            allowNull: false,
            type: DataTypes.STRING
        },
        addressline2: {
            allowNull: false,
            type: DataTypes.STRING
        },
        street: {
            allowNull: false,
            type: DataTypes.STRING
        },
        city: {
            allowNull: false,
            type: DataTypes.STRING
        },
        country: {
            allowNull: false,
            type: DataTypes.STRING
        },
        postalcode: {
            allowNull: false,
            type: DataTypes.STRING
        },
        phonenumber: {
            allowNull: false,
            type: DataTypes.STRING
        },
        isdefault:{
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

return CustomerAddressBook
}
