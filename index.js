const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const notesRoute = require("./route/notes");
const bodyParser = require("body-parser");
const mongooseConnection = require("./db/mongoose");
const listEndpoints = require("express-list-endpoints");

mongooseConnection();

require("dotenv").config();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

app.use(bodyParser.json());

var whitelist = [];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use("/notes", cors(corsOptions), notesRoute);

console.log(listEndpoints(app));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
