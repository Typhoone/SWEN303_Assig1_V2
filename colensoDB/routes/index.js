var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var fs = require('fs');
var cheerio = require('cheerio');

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



  router.get('/viewFile', function(req, res, next) {
    fs.readFile('../Colenso/' + req.query.file, function(err, data){
      if(err) {
        throw err;
      }
      $ = cheerio.load(data);

      title= $('title').text();
      author= $('author').text();
      date= $('date').text();
      front= $('front');
      body= $('body');




      res.render('viewFile', { fileName:  req.query.file, filePath: '../Colenso/' + req.query.file, title : title, author : author, date : date, front : front, body : body});


    });

  });

  router.get('/viewRaw', function(req, res, next) {
    res.download('../Colenso/' + req.query.file);
  });

  // In event of not found

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

});

module.exports = router;
