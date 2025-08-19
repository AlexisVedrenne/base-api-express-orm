const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });
module.exports = {
  development: {
    username: process.env["DB_DEV_USER"] || "base",
    password: process.env["DB_DEV_PASSWORD"] || "base",
    database: process.env["DB_DEV_NAME"] || "base_development",
    host: process.env["DB_DEV_HOST"] || "localhost",
    dialect: process.env["DB_DIALECT"] || "postgres",
    logging: process.env["DB_LOGGING"] === "true",
    port: process.env["DB_DEV_PORT"] || 5432,
  },

  test: {
    username: process.env["DB_TEST_USER"] || "base",
    password: process.env["DB_TEST_PASSWORD"] || "base",
    database: process.env["DB_TEST_NAME"] || "base_test",
    host: process.env["DB_TEST_HOST"] || "localhost",
    dialect: process.env["DB_DIALECT"] || "postgres",
    logging: process.env["DB_LOGGING"] === "true",
    port: process.env["DB_TEST_PORT"] || 5432,
  },

  production: {
    username: process.env["DB_PROD_USER"] || "base",
    password: process.env["DB_PROD_PASSWORD"] || "base",
    database: process.env["DB_PROD_NAME"] || "base_production",
    host: process.env["DB_PROD_HOST"] || "localhost",
    dialect: process.env["DB_DIALECT"] || "postgres",
    logging: process.env["DB_LOGGING"] === "true",
    port: process.env["DB_PROD_PORT"] || 5432,
  },
};
