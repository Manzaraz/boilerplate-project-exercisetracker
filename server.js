require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose");

// DB connection
const db = require("./database/database.js"),
  { UserInfo, ExerciseInfo, LogInfo } = require("./model/models.js");

db.connect();

const app = express();

// To watch if DB is connected
console.log(mongoose.connection.readyState);

// To parse request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const users = [];
// console.log(shortid.generate());

// You can POST to /api/users with form data username to create a new user.
// The returned response from POST /api/users with form data username will be an object with username and _id properties.
app.post("/api/users", (req, res) => {
  let { username } = req.body;

  UserInfo.find({ username }, function (err, userData) {
    if (err) return console.error("Error with server: ", err);
    if (userData.length === 0) {
      const newUser = new UserInfo({
        username: req.body.username,
      });

      newUser.save(function (err, data) {
        if (err) return console.error("Error Saving User: ", err);
        res.json({
          username: data.username,
          _id: data._id,
        });
      });
    } else {
      res.send({
        Error: "Username already exists",
      });
    }
  });
});

// You can make a GET request to /api/users to get a list of all users.
// The GET request to /api/users returns an array.
// Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
app.get("/api/users", (req, res) => {
  UserInfo.find(function (err, data) {
    if (err) return console.error("Error server", err);
    if (!data) return res.json({ Error: "DB have no users" });
    return res.json(data);
  });
  // return res.json({users});
});

// You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
// The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
app.post("/api/users/:_id/exercises", (req, res) => {
  let idJson = { id: req.params._id },
    checkedDate = new Date(req.body.date),
    idToCheck = idJson.id;

  const noDateHandler = () => {
    if (checkedDate instanceof Date && !isNaN(checkedDate)) {
      return checkedDate;
    } else {
      checkedDate = new Date();
    }
  };

  UserInfo.findById(idToCheck, function (err, dataForm) {
    noDateHandler(checkedDate);
    if (err) return console.error("Error with id: ", err);

    const newExercise = new ExerciseInfo({
      username: dataForm.username,
      description: req.body.description,
      duration: req.body.duration,
      date: checkedDate.toDateString(),
    });

    newExercise.save(function (err, data) {
      if (err) {
        console.error("Error sa ving exercise: ", err);
      } else {
        console.log("saved exercise successfully");
        res.json({
          _id: idToCheck,
          username: data.username,
          description: data.description,
          duration: data.duration,
          date: data.date.toDateString(),
        });
      }
    });
  });
});

// You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
// A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.

let logsArray = [];

app.get("/api/users/:_id/logs", (req, res) => {
  let { from, to, limit } = req.query;
  let id = req.params._id;

  // check Id on userinfos
  UserInfo.findById(id, function (err, data) {
    if (err) return console.err("Error With ID: ", err);

    let query = { username: data.username };

    if (from !== undefined && to === undefined) {
      query.date = { $gte: new Date(from) };
    } else if (to !== undefined && from === undefined) {
      query.date = { $lte: new Date(to) };
    } else if (from !== undefined && to !== undefined) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    let limitCheckeer = (limit) => {
      let maxLimit = 100;
      if (limit) {
        return limit;
      } else {
        return maxLimit;
      }
    };

    ExerciseInfo.find(
      query,
      null,
      { limit: limitCheckeer(+limit) },
      function (err, docs) {
        if (err) return console.error("Error with Exercise", err);
        if (!docs) return res.json({ Error: "There's no exercises logs" });

        let documents = docs;

        logsArray = documents.map((el) => {
          return {
            description: el.description,
            duration: el.duration,
            date: el.date.toDateString(),
          };
        });

        const test = new LogInfo({
          username: data.username,
          count: logsArray.length,
          log: logsArray,
        });

        test.save(function (err, logData) {
          if (err) return console.error("Error with logs", err);

          res.json({
            _id: id,
            username: logData.username,
            count: logData.count,
            log: logData.log,
          });
        });
      }
    );
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
