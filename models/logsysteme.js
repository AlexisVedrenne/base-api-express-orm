'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogSysteme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LogSysteme.init({
    message: DataTypes.STRING,
    function: DataTypes.STRING,
    code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LogSysteme',
  });
  return LogSysteme;
};