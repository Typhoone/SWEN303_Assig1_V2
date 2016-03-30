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

function runQuery(query, req, res){
  console.log('/********************************************query*******************************\\');
  console.log(query);
  var value;

  client.execute(query, function(err, reslt){
    if(err || reslt.ok === false || !(reslt.result.length > 0)){
      value = "No results found ";
      if(err){
        value += "<br> ERROR: " + err;
      }else{
        err = 'not found';
      }
    }else{
      value = reslt.result.split('\r\n');

    }


    res.render('results', {title : 'Results', val : value, err : err})
  });
}

router.post('/processXq', function(req, res, next) {
  // var query = "XQUERY declare namespace tei= 'http://www.tei-c.org/ns/1.0'; " + req.body.searchField;
  var query = 'XQUERY declare default element namespace "http://www.tei-c.org/ns/1.0"; for $n in ('+ req.body.searchField +')\n' +
                 'return db:path($n)';
  runQuery(query, req, res);
});

router.get('/explore', function(req, res, next) {
  // var query = "XQUERY declare namespace tei= 'http://www.tei-c.org/ns/1.0'; " + req.body.searchField;
  var query = 'XQUERY declare default element namespace "http://www.tei-c.org/ns/1.0"; for $n in (*)\n' +
                 'return db:path($n)';
  runQuery(query, req, res);
});

router.post('/processSimple', function(req, res, next) {
  // var query = "XQUERY declare namespace tei= 'http://www.tei-c.org/ns/1.0'; " + req.body.searchField;
  var query = 'XQUERY declare default element namespace "http://www.tei-c.org/ns/1.0"; for $v in .//TEI[. contains text ' + req.body.searchField + '] return db:path($v)';

  runQuery(query, req, res);
});

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

module.exports = router;
