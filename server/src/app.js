const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const api = require("./routes/api");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));

//Chain of middlewares (that handles the requests as they come into our application)
app.use(express.json()); //Checks the request JSON content-type and parses it, if we are passing some data!
app.use(express.static(path.join(__dirname, "..", "public"))); //This is to serve the public folder(The client of our app) from the server

//App routes
app.use("/v1", api);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
