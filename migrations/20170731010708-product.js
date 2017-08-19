'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subcategory: {
        allowNull: false,
        type: Sequelize.STRING
      },
      VendorId:{
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0
      },
      manufacturename:{
          allowNull: true,
          type: Sequelize.STRING,
          defaultValue: 'none'
      },
      modelno:{
          allowNull: true,
          type: Sequelize.STRING,
          defaultValue: 'none'
      },
      materialtype:{
          allowNull: true,
          type: Sequelize.STRING,
          defaultValue: 'none'
      },
      isfeatured:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      isnew:{
          allowNull: true,  
          type: Sequelize.BOOLEAN,
          defaultValue: true
      }, 
      gender:{
          allowNull: false,  
          type: Sequelize.CHAR(1)
      }, 
      agegroup:{
          allowNull: false,  
          type: Sequelize.CHAR(2)
      }, 
      shortdesc:{
          allowNull: true,  
          type: Sequelize.STRING(512),
          defaultValue: "no description availiable"
      }, 
      longdesc:{
          allowNull: true,  
          type: Sequelize.TEXT,
          defaultValue: "no description availiable"
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
    return queryInterface.dropTable('Products');
  }
};
