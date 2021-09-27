// requiring required modules and packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const airportCodes = require(__dirname + '/airports.js');
const airlineCodes = require(__dirname + '/airlines.js');
const mysql = require("mysql")
const port = 3000

// constant contact for page display
const predictPage = "Predict flight delay for one Airline Service."
const comparePage = "Compare flight delay for two or three Airline Services."
const recommendPage = "Get top 3 recommended Airline Services (punctuality)."
const statsPage = "Check historical performance of an Airline Service."
const resultsPage = "Your result"

// setting up
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// storing data - will be lost once the server is restarted

// const predictRequests = []
// const recommendRequests = []
// const statsRequests = []

// create database connection

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'requestsdb'
});

db.connect(function(err){
  if(err){
    console.log(err);
  }else{
    console.log('Connected')
  }
});


// get and post

// home page

app.get('/', function(req, res) {
  res.render('home', {
    predictPageContent: predictPage,
    recommendPageContent: recommendPage,
    statsPageContent: statsPage
  });
});

// results page - is not on the nav bar

app.get('/results', function(req, res) {
  res.render('results', {
    resultsPageContent: resultsPage
  });
});


// predict page

app.get('/predict', function(req, res) {
  res.render('predict', {
    predictPageContent: predictPage,
    myairportcodes : airportCodes.airport_codes(),
    myairlinecodes: airlineCodes.airline_codes()

  });
});

app.post('/predict', function(req, res){
  let request = {
    origin: req.body.origin,
    destination: req.body.destination,
    airline: req.body.airline
  };
  let sql = 'INSERT INTO predict SET ?'
  let query = db.query(sql, request, function(err, result){
    if (err) throw err;
    // console.log(result);
    res.redirect("/results");
  });
  // predictRequests.push(request);
  //
  // res.redirect("/results");
});

// recommend page

app.get('/recommend', function(req, res) {
  res.render('recommend', {
    recommendPageContent: recommendPage,
    myairportcodes : airportCodes.airport_codes(),
  });
});

app.post('/recommend', function(req, res){
  let request = {
    origin: req.body.origin,
    destination: req.body.destination,
  };
  let sql = 'INSERT INTO recommend SET ?'
  let query = db.query(sql, request, function(err, result){
    if (err) throw err;
    // console.log(result);
    res.redirect("/results");
  });

  // recommendRequests.push(request);
  // res.redirect("/results");
});

// stats page

app.get('/stats', function(req, res) {
  res.render('stats', {
    statsPageContent: statsPage,
    myairlinecodes: airlineCodes.airline_codes()
  });
});

app.post('/stats', function(req, res){
  let request = {
    airline: req.body.airline,
    start: req.body.start,
    end: req.body.end,
  };
  let sql = 'INSERT INTO stats SET ?'
  let query = db.query(sql, request, function(err, result){
    if (err) throw err;
    // console.log(result);
    res.redirect("/results");
  });
  // statsRequests.push(request);
  // res.redirect("/results");
  // console.log(statsRequests)
})


// port
app.listen(port, function(){
  console.log("Server running on port 3000");
});
