const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credentials: true
  })
);

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin@kanban-qb1vl.mongodb.net/kanban?retryWrites=true&w=majority"
);

//passport
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(
  session({
    name: "myname.sid",
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      maxAge: 36000000,
      httpOnly: false,
      secure: false
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
require("./passport-config");
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Get environment port or use 3000
const port = process.env.PORT || "3000";
app.set("port", port);

module.exports = app;
