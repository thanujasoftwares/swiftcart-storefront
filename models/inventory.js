'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Inventory = sequelize.define('Inventories', 
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
        // sku: {
        //     type:DataTypes.TEXT,
        //     allowNull: true
        // }, 
        // isfeatured:{
        //     allowNull: true,  
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // },
        // isnew:{
        //     allowNull: true,  
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // },
        // issale:{
        //     allowNull: true,  
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // },
        // isbestseller:{
        //     allowNull: true,  
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // },
        // isdeal:{
        //     allowNull: true,  
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // },
        // ishot:{
        //     allowNull: true,  
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true
        // },  
        /* -- */   
        size:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:'none'
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
        color:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'#000000'
        },
        instock:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        ordered:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        reserved:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        }, 
        /* -- */        
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
Inventory.associate = (models) => {
    Inventory.hasMany(models.ProductImages);
    Inventory.belongsTo(models.Products);
}
return Inventory;

}
