'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Review = sequelize.define('Reviews', 
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
        CustomerId:{
            allowNull: true,
            type: DataTypes.INTEGER
        },
        data: {
            type:DataTypes.STRING,
            allowNull: false,
            defaultValue: 'no review',
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9 \- \# \$ \* \!]+$", 'i']
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

return Review
}
