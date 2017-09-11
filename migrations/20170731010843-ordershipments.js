'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OrderShipments', {
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
      carrier:{
        type: Sequelize.STRING,
        allowNull:false
      },
      trackingnumber:{
        type: Sequelize.STRING,
        allowNull:false
      },
      shipdate: {
        allowNull: false,
        type: Sequelize.DATE
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
      isreturnlabel:{
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
    return queryInterface.dropTable('OrderShipments');
  }
};
