'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var Recommendation = sequelize.define('Recommendations', 
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
        ProductRecommendationId: {
            allowNull: false,
            type: DataTypes.INTEGER
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

return Recommendation
}
