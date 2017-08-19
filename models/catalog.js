'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {

var Catalog = sequelize.define('Catalogs', 
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
        description: {
            type:DataTypes.TEXT,
            allowNull: true
        },      
        type: {
            allowNull: false,
            type: DataTypes.STRING
        },
        data:{
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


return Catalog
}