var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso' });
});

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Colenso Search' });
});

router.post('/processXq', function(req, res, next) {
  var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " + req.body.searchField;
  var value;

  client.execute(query, function(err, reslt){
    if(err){
      value = "No results found \n ERROR: " + err;
    }else{
      value = reslt.result;
    }
    res.render('results', {title : 'Results', val : value})
  });



});

module.exports = router;
