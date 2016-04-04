var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Directory = require('../models/directory');
var Business = require('../models/business');
var passport = require('passport');

// set up the GET handler for the directories page
router.get('/', isLoggedIn, function(req, res, next) {
    // use the Business model to retrieve all businesses
    Business.find(function (err, business) {
        // if we have an error
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            // we got data back
            // show the view and pass the data to it
            res.render('businesses/business', {

                title: 'Business Directory'
           
            });
        }
    });
});

// GET handler for add to display a blank form
router.get('/add',isLoggedIn, function(req, res, next) {
    res.render('businesses/add', {
        title: 'Add a New Business'
    });
});

// POST handler for add to process the form
router.post('/add', function(req, res, next) {

    // save a new business using our Business model and mongoose
    Business.create( {
            name: req.body.name,
            contact: req.body.contact,
            phone: req.body.phone,
            address: req.body.address,
            website: req.body.website,
        }
    );

    // redirect to main directory page
    res.redirect('/directory');
});

// GET handler for edit to show the populated form
router.get('/:id', isLoggedIn, function(req, res, next) {
   // create an id variable to store the id from the url
    var id = req.params.id;

    // look up the selected business
    Business.findById(id,  function(err, business) {
       if (err) {
           console.log(err);
           res.end(err);
       }
        else {
           // show the edit view
           res.render('businesses/edit', {
               title: 'Business Details'
           });
       }
    });
});

// POST handler for edit to update the business
router.post('/:id', function(req, res, next) {
    // create an id variable to store the id from the url
    var id = req.params.id;

    // fill the business object
    var business = new Business( {
        _id: id,
        name: req.body.name,
        contact: req.body.contact,
        phone: req.body.phone,
        address: req.body.address,
        website: req.body.website,
    });

    
    //update business directory with mongoose
    Business.update( { _id: id }, business,  function(err) {
        if (err) {
            console.log(err)
            res.end(err);
        }
        else {
            res.redirect('/business');
        }
    });
});

// GET handler for delete using the business id parameter
router.get('/delete/:id', isLoggedIn, function(req, res, next) {
   // grab the id parameter from the url
    var id = req.params.id;

    console.log('trying to delete');

    Business.remove({ _id: id }, function(err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            // show updated directory of businesses 
            res.redirect('/business');
        }
    });
});


//auth check
function isLoggedIn(req, res, next){
    //is the user authenticated?
    if(req.isAuthenticated()){
        //if it is go to the next part of the request
        return next;
    }
    else{
        res.redirect('/auth/login');
    }
}

// make public
module.exports = router;
