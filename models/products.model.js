"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "users"
      });
    }
  }
  Products.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("FOR_SALE", "SOLD_OUT"),
        allowNull: false,
        defaultValue: "FOR_SALE"
      }
    },
    {
      sequelize,
      modelName: "Products",
      timestamps: true
    }
  );
  return Products;
};
