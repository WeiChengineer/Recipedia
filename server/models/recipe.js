// models/recipe.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      // define association here
      Recipe.belongsTo(models.Restaurant, { foreignKey: 'restaurantid' });
      Recipe.belongsTo(models.User, { foreignKey: 'userid' });
    }
  }
  Recipe.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    restaurantid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Restaurants',
        key: 'restaurantid'
      }
    },
    notes: {
      type: DataTypes.TEXT
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'userid'
      }
    },
    image: {
      type: DataTypes.TEXT
    },
    ingredients: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    steps: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    }
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};
