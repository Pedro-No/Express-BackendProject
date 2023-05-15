// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

//App Routes
const public = require("./routes/public.routes");
app.use("/", public);

const private = require("./routes/private.routes");
app.use("/", private);

//Handles errors of routes that don't exist
require("./error-handling")(app);

module.exports = app;
