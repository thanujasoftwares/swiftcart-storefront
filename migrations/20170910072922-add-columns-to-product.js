'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.addColumn('Products', 'isactive', Sequelize.BOOLEAN, {transaction: t}),
      ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.removeColumn('Products', 'isactive', {transaction: t}),
      ]);
    });
  }
};
