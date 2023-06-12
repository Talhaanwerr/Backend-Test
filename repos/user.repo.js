const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");

module.exports.isUserExists = async (username) => {
  return await User.count({
    where: {
      username,
    },
  });
};

module.exports.createUser = async (user) => {
  let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
  let hashedPassword = bcrypt.hashSync(user.password, salt);
  return await User.create({
    username: user.username,
    password: hashedPassword,
  });
};

module.exports.findUser = async (username) => {
  return await User.findOne({
    where: {
      username,
    },
  });
}
