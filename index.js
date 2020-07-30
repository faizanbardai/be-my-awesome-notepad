const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const notesRoute = require("./route/notes");
const bodyParser = require("body-parser");
const mongooseConnection = require("./db/mongoose");
const listEndpoints = require("express-list-endpoints");

// Connecting to database
mongooseConnection();

// Loading environment variables
require("dotenv").config();

// Assigning port value from environment
const port = process.env.PORT;

// Serving build folder on "/" request
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

// Parsing body request in JSON format
app.use(bodyParser.json());

// Whitelisting URLs to serve data when being accessed from cross-origin
var whitelist = [
  "http://localhost:3000",
  "https://my-awesome-notepad.herokuapp.com",
];

// Throwing CORS error if the URL is not whitelisted
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Accessing Notes route
app.use("/notes", cors(corsOptions), notesRoute);

// Logging all the end points
console.log(listEndpoints(app));

// Listening for server requests
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
