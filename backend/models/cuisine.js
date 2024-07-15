
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    static associate(models) {
      Cuisine.belongsTo(models.User, { foreignKey: 'userid' });
      Cuisine.hasMany(models.Restaurant, { foreignKey: 'cuisineid' });
    }
  }
  Cuisine.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    country: DataTypes.STRING,
    value: DataTypes.STRING,
    userid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cuisine',
  });
  return Cuisine;
};