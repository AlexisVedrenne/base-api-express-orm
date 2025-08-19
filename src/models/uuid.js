"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Uuid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Uuid.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Uuid.init(
    {
      uuid: DataTypes.STRING,
      expiration: DataTypes.DATE,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Uuid",
    }
  );
  return Uuid;
};
