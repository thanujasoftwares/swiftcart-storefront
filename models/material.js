'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Material = sequelize.define('Materials', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name:{
            type:DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9 \-]+$", 'i']
            }
        },
        model:{
            type:DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9 \-]+$", 'i']
            }
        },
        color:{
            type:DataTypes.STRING(8),
            allowNull: false,
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9\#]+$", 'i']
            }
        },
        ImageId:{
            type:DataTypes.INTEGER,
            allowNull: true,
            defaultValue:0
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
return Material
}