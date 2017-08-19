'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Ratings', {
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
      star1: {
          type:Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      star2: {
          type:Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      star3: {
          type:Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      star4: {
          type:Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
      },
      star5: {
          type:Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
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
    return queryInterface.dropTable('Ratings');
  }
};
