var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoHeadlines", {useNewUrlParser: true });
//from gitlab:
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

app.get("/scrape", function(req, res) {
  axios.get("https://www.wsj.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("h3").each(function(i, element) {
      var result = {};

      result.title = $(this).children("name").text();
      result.link = $(this).children().attr("href")

      db.Article.create(result)
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        return res.json(err);
      });
    });
    res.send("WSJ Scrape Complete!");
  });
});

//get  all articles
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticles) {
    res.json(dbArticles);
  })
  .catch(function(err) {
    res.json(err);
  });
});

//get article by id
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndIpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});