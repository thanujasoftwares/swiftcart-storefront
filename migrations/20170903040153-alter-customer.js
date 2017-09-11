'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.addColumn('Customers', 'customertype', Sequelize.STRING(1), {transaction: t})
      ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.removeColumn('Customers', 'customertype', {transaction: t}),
      ]);
    });
  }
};
