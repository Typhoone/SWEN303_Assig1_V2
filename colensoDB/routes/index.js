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
  res.render('search', { title: 'Search' });
});

router.post('/processXq', function(req, res, next) {
  // var query = "XQUERY declare namespace tei= 'http://www.tei-c.org/ns/1.0'; " + req.body.searchField;
  var query = 'XQUERY declare default element namespace "http://www.tei-c.org/ns/1.0"; for $n in ('+ req.body.searchField +')\n' +
                 'return db:path($n)';
  var value;

  client.execute(query, function(err, reslt){
    if(req.body.searchField){
      if(err){
        value = "No results found \n ERROR: " + err;
      }else{
        value = reslt.result.split('\r\n');
      }
    }
    res.render('results', {title : 'Results', val : value})
  });

  router.get('/viewFile', function(req, res, next) {
    res.render('viewFile', { title: 'fileName', filePath: '../Colenso/' + req.query.file });
  });

  router.get('/viewRaw', function(req, res, next) {
    res.download('../Colenso/' + req.query.file);
  });



});

module.exports = router;
