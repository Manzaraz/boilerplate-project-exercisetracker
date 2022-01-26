require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser");

// DB conection
const db = require("./database/database.js"),
  User = require("./model/User");

db.connect();

const app = express();

// To watch if DB is connected
console.log(mongoose.connection.readyState); // 1 or 2 it's ok

// To parse request
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Static files
app.use(express.static("public"));

// Routing
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", function (req, res) {
  // res.send(`Hello from "/api/users"`);
  // console.log(req.body);
  let bodyUser = req.body.username;
  console.log(bodyUser);

  const newUser = new User({ username: bodyUser });
  newUser.save(function (err, data) {
    if (err) {
      res.json({ error: "User already taken" });
    } else {
      res.json({
        username: newUser.username,
      });
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
