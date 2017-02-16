var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require("mongoose");
require("./models/Questions");
require("./models/Answers");
require("./models/Users");
require("./models/Coupons");
require("./models/Companies");



var passport = require("passport");
require("./config/passport");

var indexRoutes = require("./routes/index");
var partialsRoutes = require("./routes/partials");
var questionsRoutes = require("./routes/questions");
var answersRoutes = require("./routes/answers");
var authRoutes = require("./routes/auth");
var usersRoutes = require("./routes/users");
var companiesRoutes = require("./routes/companies");
// var couponsRoutes = require("./routes/coupons");



var app = express();

mongoose.connect("mongodb://localhost/news");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// unanswer after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use("/", indexRoutes);
app.use("/", partialsRoutes);
app.use("/", questionsRoutes);
app.use("/", answersRoutes);
app.use("/", authRoutes);
app.use("/", usersRoutes);
app.use("/", companiesRoutes);
// app.use("/", couponsRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
