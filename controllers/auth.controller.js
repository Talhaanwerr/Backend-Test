const UserRepo = require("../repos/user.repo");
const { validateUser, generateAuthToken } = require("../models/user");
const bcrypt = require("bcrypt");

// Create and Save a new User
exports.signup = async (req, res) => {
  const { error } = validateUser(req.body); // Validate the user input
  if (error) {
    // If validation fails, return a 400 error with the validation error messages
    return res.status(400).json({
      errors: error.details.map((err) =>
        err.message.replace(/\\/g, "").replace(/"/g, "")
      ),
    });
  }
  try {
    let isUserExists = await UserRepo.isUserExists(req.body.username); // Check if the user already exists
    if (isUserExists) {
      return res.status(400).json({ errors: ["Username already taken"] });
    }
    let user = await UserRepo.createUser(req.body); // Create the user
    const { password, ...userObj } = user.dataValues; // Remove the password field from the user object

    return res.status(201).json({
      user: userObj,
      message: "User was registered successfully!",
    });
  } catch (error) {
    return res.status(400).json({ errors: [error.message] });
  }
};

exports.login = async (req, res) => {
  const { error } = validateUser(req.body); // Validate the user input
  if (error) {
    // If validation fails, return a 400 error with the validation error messages
    return res.status(400).json({
      errors: error.details.map((err) =>
        err.message.replace(/\\/g, "").replace(/"/g, "")
      ),
    });
  }

  let user = await UserRepo.findUser(req.body.username); // Find the user by username
  if (!user) {
    return res.status(404).json({ errors: ["Invalid Email or Password."] });
  }

  var passwordIsValid = bcrypt.compareSync(req.body.password, user.password); // Compare the provided password with the stored password

  if (!passwordIsValid) {
    // If the passwords do not match, return a 400 error indicating that the email or password is invalid
    return res.status(401).json({ errors: ["Invalid Email or Password..."] });
  }

  const { userObj, token } = generateAuthToken(user); // Generate an authentication token

  res.status(200).json({
    user: userObj,
    token,
  });
};

exports.protectedRoute = async (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully" });
};
