var express = require('express');
var router = express.Router();

//add auth package refs
var passport = require('passport');
var mongoose = require('mongoose');
var Directory = require('../models/directory');
var gitHub = require('passport-github2');
var configDb = require('../config/db.js');


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(err, user);
});

//github auth config
passport.use(new gitHub({
    clientID: configDb.githubClientID,
    clientSecret: configDb.clientSecret,
    callbackURL: configDb.githubCallbackUrl
}, function (accessToken, refreshToken, profile, done) {
    var searchQuery = { name: profile.displayName };
    
    // var updates = {
    //     name: profile.displayName,
    //     someID: profile.id
    // };
}
    ));

//GET github login
router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));

//GET github callback
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/auth/login'
}),
    function (req, res) {
        res.redirect('/directory');
    }


    );

// GET register - show registration form
router.get('/register', function (req, res, next) {
    res.render('auth/register', {
        title: 'Register'
    });
});


//GET welcome page for authenticated users
router.get('/welcome', function (req, res, next) {
    if (req.isAuthenticated) {
        res.render('auth/welcome', {
            title: 'Welcome',
            user: req.user
        });
    }

});



//POST register - save new user
router.post('/register', function (req, res, next) {
    Directory.register(new Directory({ username: req.body.username }), req.body.password, function (err, account) {
        if (err) {
            res.render('auth/register', { title: 'Register' });
        }
        else {
            req.login(Directory, function (err) {
                res.redirect('/directory');
            });
        }
    });
});


// GET login - show login form
router.get('/login', function (req, res, next) {
    
    //store the session messages
    var messages = req.session.messages || [];
    
    //clear the messages
    req.session.messages = [];
    
    //check if user is already logged in
    if (req.isAuthenticated) {
        res.redirect('/auth/welcome');
    }
    else {
        
        //show the login page and pass in any messages we may have
        res.render('auth/login', {
            title: 'Login',
            user: req.user,
            messages: messages
        });
    }
    
    
    
    
    //clear out session messages after otherwise the message array keeps getting added on to everytime
    req.session.messages = []
});


//POST login to validate user
//authenticate method belongs to passport - local means users are stored in some kind of database
//flash allows us to use the failure message
router.post('/login', passport.authenticate('local', {
    successRedirect: '/directory',
    failureRedirect: 'auth/login',
    failureMessage: 'Invalid Login'
}));

// make this public
module.exports = router, passport;
