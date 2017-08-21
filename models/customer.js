'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Customer = sequelize.define('Customers', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING
        },
        phonenumber: {
            allowNull: false,
            type: DataTypes.STRING
        },
        hashcode: {
            allowNull: false,
            type: DataTypes.STRING
        },
        isblocked:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },      
        isverified:{
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
    },
    {
        associate:function(models){
            Customer.hasMany(models.Orders);
        }
    }   
);

// /* Relationship */

Customer.associate = (models) => {
    Customer.hasMany(models.Orders);
    Customer.hasMany(models.CustomerAddressBooks);
}


// /* Class Methods */
// Customer.get = function(id){
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
//             model:sequelize.models.CustomerAddressBooks
//         },
//         {
//             model:sequelize.models.Orders
//         }
//         ],
//         where:where
//     });
// };

return Customer
}
