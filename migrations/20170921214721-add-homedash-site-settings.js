'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SiteAttributes', [
      {
        key: 'homedash1',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash2',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash3',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash4',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash5',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash6',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash7',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homedash8',
        value0: 'images/no_image_dash.gif',
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('SiteAttributes', null, {});
  }
};
