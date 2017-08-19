'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ProductId: {
          type:Sequelize.INTEGER,
          allowNull: false
      },
      sku: {
          type:Sequelize.STRING,
          allowNull: false
      },              
      quantity: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      unitprice: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      discount:{
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue:0
      },
      discountcode:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:0
      },
      shippingprice: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue:0
      },  
      status:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:'new'
      },
      instructions:{
        type: Sequelize.STRING,
        allowNull:true,
        defaultValue:'none'
      },  
      iscancelled:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isconfirmed:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }, 
      isshipped:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }, 
      isreceived:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isreturned:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },                                         
      isdeleted:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('OrderItems');
  }
};
