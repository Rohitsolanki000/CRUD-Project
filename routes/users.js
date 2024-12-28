var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users',{title :'user list'});
});

router.get('/details', function(req, res, next) {
  res.render('details', {title : 'user details'});
});

router.get('/details/value', function(req, res, next) {
  res.render('value', {title : 'user value'});
});

module.exports = router;
