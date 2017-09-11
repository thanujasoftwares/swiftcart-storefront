'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SiteAttributes', [
      {
        key: 'title',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'logo',
        value0:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },       
      {
        key: 'gascode',
        createdAt: new Date(),
        updatedAt: new Date()
      },   
      {
        key: 'addcode',
        createdAt: new Date(),
        updatedAt: new Date()
      },   
      {
        key: 'faq0',
        value0:'How Cash on Delivery method works ?',
        createdAt: new Date(),
        updatedAt: new Date()
      },   
      {
        key: 'faq1',
        value0:'How PayTM Payment method works ?',
        createdAt: new Date(),
        updatedAt: new Date()
      },   
      {
        key: 'faq2',
        value0:'How many day will you ship this product ?',
        createdAt: new Date(),
        updatedAt: new Date()
      },       
      {
        key: 'faq3',
        value0:'What is your return/cancellation policy ?',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq4',
        value0:'What is your return/cancellation policy ?',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'faq10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'tncstmt',
        createdAt: new Date(),
        updatedAt: new Date()
      },       
      {
        key: 'prvstmt',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'lgstmt',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'offaddr',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'ccpno',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'abtus',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'cceaddr',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'fburl',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'twurl',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        key: 'yturl',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      
  ]);
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('SiteAttributes', null, {});
  }
};
