"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

module.exports.validateUser = (user) => {
  const validator = Joi.object().keys({
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  });
  return validator.validate(user, { abortEarly: false });
};

module.exports.generateAuthToken = (user) => {
  const userObj = user.dataValues;
  delete userObj.password;
  const token = jwt.sign(userObj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { userObj, token };
};
