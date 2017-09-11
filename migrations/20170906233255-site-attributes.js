'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('SiteAttributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
          type:Sequelize.STRING,
          allowNull: false
      },      
      value1: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value2: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value3: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value4: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value5: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value6: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value7: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value8: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value9: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      value0: {
        allowNull: true,
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('SiteAttributes');
  }
};
