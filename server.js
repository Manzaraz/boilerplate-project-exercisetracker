require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser");

// DB conection
const db = require("./database/database.js"),
  { User, Exercise } = require("./model/models.js");

db.connect();

const app = express();

// To watch if DB is connected
console.log(mongoose.connection.readyState); // 1 or 2 it's ok

// To parse request
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// Static files
app.use(express.static("public"));

// Routing
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//  Create a userName model
app.post("/api/users", function (req, res) {
  const newUser = new User({
    username: req.body.username,
  });
  newUser.save(function (error, data) {
    if (error) {
      res.json({ error: "Username already taken" });
    } else {
      res.json({ username: newUser.username, _id: newUser._id });
    }
  });
});

// petición GET a "/api/users" para obtener una lista con todos los usuarios.
app.get("/api/users", (req, res) => {
  User.find({}, (err, users) => {
    if (!err) {
      res.send(users);
    } else {
      return;
    }
  });
});

// POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
app.post("/api/users/:_id/exercises", (req, res) => {
  let id = req.params._id;
  // console.log(req.body);

  User.findById(id, function (error, data) {
    if (!data) return res.json({ error: `Unknown UserId ${error}` });
    // console.log(data);
    if (!req.body.date) {
      data.exercises.push({
        date: new Date().toDateString(),
        description: req.body.description,
        duration: req.body.duration,
      });
      // console.log(data.exercises);
      data.save(data.exercises);
      res.json({
        _id: id,
        username: data.username,
        date: new Date().toDateString(),
        description: req.body.description,
        duration: req.body.duration,
      });
    } else {
      data.exercises.push({
        date: new Date(req.body.date).toDateString(),
        description: req.body.description,
        duration: req.body.duration,
      });
      data.save(data.exercises);
      res.json({
        _id: id,
        username: data.username,
        date: new Date(req.body.date).toDateString(),
        description: req.body.description,
        duration: req.body.duration,
      });
    }
  });
});

// Puedes hacer una petición GET a /api/users/:_id/logs para recuperar un log completo del ejercicio de cualquier usuario.
app.get("/api/users/:_id/logs", (req, res) => {
  // let id = req.params._id,
  //   fromDate,
  //   toDate,
  //   limit;

  // if (req.query.from) {
  //   fromDate = new Date(req.query.from);
  // } else {
  //   fromDate = new Date("0001-01-01");
  // }

  // if (req.query.to) {
  //   toDate = new Date(req.query.to);
  // } else {
  //   toDate = new Date();
  // }

  // if (isNaN(fromDate) && req.query.from)
  //   return res.json({ error: "'from' is not a valid date format" });
  // if (isNaN(toDate) && req.query.to)
  //   return res.json({ error: "'to' is not a valid date format" });

  // if (fromDate > toDate)
  //   return res.json({
  //     error: "'from' date is more recent than the 'to' date.",
  //   });

  // if (isNaN(0 + req.query.limit) && req.query.limit) {
  //   return res.json({
  //     error: "'limit' is not an integer number, please try again",
  //   });
  // } else {
  //   limit = parseInt(req.query.limit);
  // }

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.json({
  //     Error:
  //       "User ID is not in a valid ID format. Please check it and try again.",
  //   });
  // }

  // User.find({
  //   _id: id,
  //   date: { $gte: fromDate, $lte: toDate },
  // })
  //   .select("Description duration date -_id")
  //   .limit(limit)
  //   .exec(function (err, data) {
  //     if (err)
  //       return console.error("Error trying to find matching username", err);
  //     if (data.length > 0) {
  //       // We have a matching user, so let's respond with a JSON object containing their exercise log, including user details and log count, as per the user story requirements:
  //       return res.json({
  //         username: username,
  //         _id: userId,
  //         count: data.length,
  //         log: [
  //           {
  //             description: data.exercises.description,
  //             duration: data.exercises.description,
  //             date: new Date(data.exercises.date).toDateString,
  //             _id: data.exercises._id,
  //           },
  //         ],
  //       });
  //     } else {
  //       return res.json({
  //         Error:
  //           "User " +
  //           username +
  //           " (user ID: " +
  //           userId +
  //           ") doesn't have any exercises saved yet.",
  //       });
  //     }
  //   });

  /**  first try */
  let { id, from, to, limit } = req.params;

  User.findById(id, function (err, data) {
    if (err) return console.log(err);
    if (!data) {
      res.json({ error: "Unknown userId" });
    } else {
      console.log(data);
      res.json({
        _id: data._id,
        username: data.username,
        count: data.exercises.length,
        log: data.exercises,
      });
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
