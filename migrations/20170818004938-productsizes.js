'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProductSizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      InventoryId: {
        allowNull: false,
        type: Sequelize.INTEGER
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
      color:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:'#000000'
      },
      instock:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      ordered:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      reserved:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      size:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:'none'
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
    return queryInterface.dropTable('ProductSizes');
  }
};
