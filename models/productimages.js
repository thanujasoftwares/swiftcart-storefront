'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {

var ProductImage = sequelize.define('ProductImages', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        ProductId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        InventoryId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },        
        path: {
            type:DataTypes.STRING,
            allowNull: true,
            defaultValue:'http://localhost:3000/'
        },      
        type: {
            allowNull: false,
            type: DataTypes.STRING
        },
        actual:{
            type: DataTypes.TEXT,
            allowNull: false
        },      
        xxl:{
            type: DataTypes.TEXT,
            allowNull: false
        },      
        xl:{
            type: DataTypes.TEXT,
            allowNull: false
        },      
        lg:{
            type: DataTypes.TEXT,
            allowNull: false
        },      
        md:{
            type: DataTypes.TEXT,
            allowNull: false
        },      
        sm:{
            type: DataTypes.TEXT,
            allowNull: false
        },      
        xs:{
            type: DataTypes.TEXT,
            allowNull: false
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

return ProductImage
}


