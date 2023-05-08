const mongoose = require("mongoose");
const { env } = require("process");

require("./styles-model");

mongoose.connect(env.DB_URL);

mongoose.connection.on("connected", function () {
  console.log("mongoose connected", "swimmingStyles");
});

mongoose.connection.on("disconnected", function () {
  console.log("mongoose disconnected");
});

mongoose.connection.on("error", function (err) {
  console.log("mongoose connection error", err);
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("mongoose disconnected by app disconnect");
    process.exit(0);
  });
});

process.on("SIGTERM", function () {
  mongoose.connection.close(function () {
    console.log("mongoose disconnected by app termination");
    process.exit(0);
  });
});

process.on("SIGUSR2", function () {
  mongoose.connection.close(function () {
    console.log("mongoose disconnected by app restart");
    process.kill(process.pid, "SIGUSR2");
  });
});
