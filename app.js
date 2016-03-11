var util = require("util");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var compression = require("compression");
var cors = require("cors");

var routes = require("./routes/index");
var log = require("./routes/log");
var api = require("./routes/api");

var config = require("./config");
var Mongo = require("./mongo");
//var Humidity = require("./humidity");


var app = express();

// custom entries
app.set("config", config);

var mongo = new Mongo(app);
app.set("mongo", mongo);

//if (config.useSerial) {
//  var humidity = new Humidity(app);
//  app.set("humidity", humidity);
//}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.use(compression());
app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
//noinspection JSUnresolvedFunction
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//noinspection JSUnresolvedFunction
app.use(require("stylus").middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/log", log);
app.use("/api", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});


module.exports = app;
