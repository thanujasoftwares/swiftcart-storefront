'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.addColumn('Customers', 'authcode', Sequelize.STRING, {transaction: t})
      ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.removeColumn('Customers', 'authcode', {transaction: t}),
      ]);
    });
  }
};
