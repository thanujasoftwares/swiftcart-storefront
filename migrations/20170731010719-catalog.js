'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Catalogs', {
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
      description: {
          type:Sequelize.TEXT,
          allowNull: true
      },      
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      data:{
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
    return queryInterface.dropTable('Catalogs');
  }
};
