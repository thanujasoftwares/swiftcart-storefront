'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Inventories', {
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
      isfeatured:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      isnew:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      issale:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      isbestseller:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      isdeal:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      ishot:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      sku: {
          type:Sequelize.TEXT,
          allowNull: true
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
    return queryInterface.dropTable('Inventories');
  }
};
