// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI =
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@voguevibes.xtkitb4.mongodb.net/?retryWrites=true&w=majority` || "mongodb://127.0.0.1:27017/VogueVibes";

mongoose.connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${databaseName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
