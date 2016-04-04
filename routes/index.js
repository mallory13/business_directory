var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Home page',
        message: 'Get your business noticed today. Add it to our business directory!'});
});



// make this public so the rest of app can see it
module.exports = router;
