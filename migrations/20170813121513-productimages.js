'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProductImages', {
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
      path: {
          type:Sequelize.STRING,
          allowNull: true
      },      
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      actual:{
        type: Sequelize.TEXT,
        allowNull: false
      },      
      xl:{
        type: Sequelize.TEXT,
        allowNull: false
      },      
      lg:{
        type: Sequelize.TEXT,
        allowNull: false
      },      
      md:{
        type: Sequelize.TEXT,
        allowNull: false
      },      
      sm:{
        type: Sequelize.TEXT,
        allowNull: false
      },      
      xs:{
        type: Sequelize.TEXT,
        allowNull: false
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
    return queryInterface.dropTable('ProductImages');
  }
};
