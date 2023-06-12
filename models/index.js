"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
// Create Sequelize instance based on the configuration
if (config.use_env_variable) {
  // If a database URL is specified in the environment variable, use it
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Otherwise, use the configuration values for database connection
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load models from the models directory
fs.readdirSync(__dirname)
  .filter((file) => {
    // Filter out non-JavaScript files and the current file (index.js)
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // Import each model and associate it with the Sequelize instance
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Run the associations between models if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Store the Sequelize instance and the Sequelize library in the export object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
