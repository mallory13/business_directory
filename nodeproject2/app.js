var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

// auth packages
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var localStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable flash for showing messages
app.use(flash());

// passport config section
app.use(session({
  secret: 'lesson8 auth',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// use the Account model we built
var Account = require('./models/account');
passport.use(Account.createStrategy());

// methods for accessing the session data
passport.serializeUser(Account.serializeUser);
passport.deserializeUser(Account.deserializeUser);

app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);
app.use('/auth', auth);

// db connection
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB Error: '));

db.once('open', function(callback) {
  console.log('Connected to mongodb');
});

// connect to local instance directly
// mongoose.connect('mongodb://localhost/test');

// connect to mlab instance directly
// mongoose.connect('mongodb://gcrfreeman:2106pass@ds056288.mlab.com:56288/comp2106');

// read db connection string from our config file
var configDb = require('./config/db.js');
mongoose.connect(configDb.url);

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
