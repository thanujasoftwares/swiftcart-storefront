'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
var OrderShipment = sequelize.define('OrderShipments', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        OrderId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        carrier:{
            type: DataTypes.STRING,
            allowNull:false
        },
        trackingnumber:{
            type: DataTypes.STRING,
            allowNull:false
        },
        shipdate: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        shippingprice: {
            allowNull: false,
            type: DataTypes.FLOAT,
            defaultValue:0
        },  
        status:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'new'
        },
        instructions:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue:'none'
        },  
        iscancelled:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isconfirmed:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }, 
        isshipped:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }, 
        isreceived:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isreturnlabel:{
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
    }    
);

// /* Relationship */
OrderShipment.associate = (models) => {
    OrderShipment.belongsTo(models.Orders);
}

return OrderShipment
}
