'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Menu = sequelize.define('Menus', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        category:{
            type:DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9 ]+$", 'i']
            }
        },
        subcategory:{
            type:DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9 ]+$", 'i']
            }
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
return Menu
}