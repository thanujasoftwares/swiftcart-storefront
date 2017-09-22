'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SiteAttributes', [
      {
        key: 'homedash',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'themecolor',
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('SiteAttributes', null, {});
  }
};
