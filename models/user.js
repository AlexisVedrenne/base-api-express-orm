"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: "UserRoles", // table pivot
        as: "roles",
        foreignKey: "userId",
      });
      User.hasMany(models.Uuid, {
        foreignKey: "userId",
        as: "uuids",
      });
    }
  }
  User.init(
    {
      lastName: DataTypes.STRING,
      name: DataTypes.STRING,
      mail: DataTypes.STRING,
      password: DataTypes.STRING,
      timeAccess: DataTypes.INTEGER,
      lastLogin: DataTypes.DATE,
      imageUrl: DataTypes.STRING,
      imageName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
