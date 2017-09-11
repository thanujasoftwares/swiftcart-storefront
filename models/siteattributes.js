'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var SiteAttribute = sequelize.define('SiteAttributes', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        key: {
            type:DataTypes.STRING,
            allowNull: false
        },      
        value1: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value2: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value3: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value4: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value5: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value6: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value7: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value8: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value9: {
          allowNull: true,
          type: DataTypes.TEXT
        },
        value0: {
          allowNull: true,
          type: DataTypes.TEXT
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

return SiteAttribute
}
