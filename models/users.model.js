"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Products, {
        foreignKey: "userId",
        as: "products"
      });
    }
  }
  Users.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Users",
      timestamps: true,
      hooks: {
        beforeCreate: async user => {
          if (user.password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async user => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    }
  );
  return Users;
};
