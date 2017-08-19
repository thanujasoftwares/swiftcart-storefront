'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CustomerId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      externalOrderId: {
          type:Sequelize.TEXT,
          allowNull: true
      },      
      totalprice: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      totaldiscount:{
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue:0
      },
      discountcode:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:0
      },
      tax:{
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue:0.18
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
      paymentmethod:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:'cc'
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
    return queryInterface.dropTable('Orders');
  }
};
