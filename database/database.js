const mongoose = require("mongoose");

exports.connect = () => {
  const mySecret = process.env["MONGO_URI"],
    connectionParams = {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    };
  mongoose
    .connect(mySecret, connectionParams)
    .then(() => {
      console.log("Database successfully connected");
    })
    .catch((err) => {
      console.log(`Error connecting to the database: n\ ${err}`);
    });

  return mongoose.connection;
};
