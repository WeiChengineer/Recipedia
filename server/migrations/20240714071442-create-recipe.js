// migrations/XXXXXX-create-recipe.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Recipes', {
      recipeid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      restaurantid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Restaurants',
          key: 'restaurantid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      notes: {
        type: Sequelize.TEXT,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      image: {
        type: Sequelize.TEXT,
      },
      ingredients: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      steps: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Recipes');
  }
};
