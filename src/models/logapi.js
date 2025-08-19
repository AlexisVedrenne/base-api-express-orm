'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogApi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LogApi.init({
    method: DataTypes.STRING,
    uri: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    statusCode: DataTypes.INTEGER,
    requestBody: DataTypes.TEXT,
    responseBody: DataTypes.TEXT,
    responseTime: DataTypes.INTEGER,
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LogApi',
  });
  return LogApi;
};