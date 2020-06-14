var express = require("express");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cors = require("cors");

//Init express
const app = express();

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credentials: true
  })
);

var mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin@kanban-qb1vl.mongodb.net/kanban?retryWrites=true&w=majority"
);

//passport
var passport = require("passport");
var session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(
  session({
    name: "authentication",
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

//Get environment port or use 3001
const port = process.env.PORT || "3001";
console.log("port", port);
app.set("port", port);
