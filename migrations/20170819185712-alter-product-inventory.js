'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.addColumn('Products', 'sku', Sequelize.STRING, {transaction: t}),
       queryInterface.addColumn('Products', 'issale', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('Products', 'isbestseller', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('Products', 'isdeal', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('Products', 'ishot', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('OrderItems', 'InventoryId', Sequelize.INTEGER, {transaction: t}),
       queryInterface.addColumn('Orders', 'TrackingNumber', Sequelize.TEXT, {transaction: t}),
       queryInterface.addColumn('OrderAddressBooks', 'CustomerAddressBookId', Sequelize.INTEGER, {transaction: t}),
       queryInterface.removeColumn('Inventories', 'sku', {transaction: t}),
       queryInterface.removeColumn('Inventories', 'issale', {transaction: t}),
       queryInterface.removeColumn('Inventories', 'isbestseller', {transaction: t}),
       queryInterface.removeColumn('Inventories', 'isdeal', {transaction: t}),
       queryInterface.removeColumn('Inventories', 'ishot', {transaction: t}),
      ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction (t) {
      return Promise.all([
       queryInterface.addColumn('Inventories', 'sku', Sequelize.STRING, {transaction: t}),
       queryInterface.addColumn('Inventories', 'issale', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('Inventories', 'isbestseller', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('Inventories', 'isdeal', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.addColumn('Inventories', 'ishot', Sequelize.BOOLEAN, {transaction: t}),
       queryInterface.removeColumn('Products', 'sku', {transaction: t}),
       queryInterface.removeColumn('Products', 'issale', {transaction: t}),
       queryInterface.removeColumn('Products', 'isbestseller', {transaction: t}),
       queryInterface.removeColumn('Products', 'isdeal', {transaction: t}),
       queryInterface.removeColumn('Products', 'ishot', {transaction: t}),
       queryInterface.removeColumn('OrderItems', 'InventoryId', {transaction: t}),
       queryInterface.removeColumn('Orders', 'TrackingNumber', {transaction: t}),
       queryInterface.removeColumn('OrderAddressBooks', 'CustomerAddressBookId', {transaction: t}),
      ]);
    });
  }
};
