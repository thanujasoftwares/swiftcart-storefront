'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Rating = sequelize.define('Ratings', 
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
        star1: {
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        star2: {
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        star3: {
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        star4: {
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        star5: {
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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

return Rating
}
