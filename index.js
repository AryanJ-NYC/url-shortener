"use strict"
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      portNumber = process.env.PORT || process.argv[2] || 8080,
      mongoPort = 27017,
      dataBasename = 'urlshortener',
      autoIncrement = require('mongoose-auto-increment');

let db = mongoose.createConnection('mongodb://localhost:' + mongoPort + '/' + dataBasename);
autoIncrement.initialize(db);

let urlSchema = new Schema({
  url : { type: String, index : { unique : true } }
});
urlSchema.index({ url: 1 });
urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: 'urlId', startAt: 1 });
let Url = db.model('Url', urlSchema);

app
.get(/\/new\/(.+)/, function (req, res) {
  let urlRegex = /^https?:\/\/(\w+\.)+\w+/,
      urlString = req.params[0];
  Url.findOne({ url: urlString }, function (err, result) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      if (result) {
        // send the result if the url passed in is matched
        res.json({
          url: result.url,
          urlId: result.urlId,
          _id: result._id
        });
      } else {
        // if not found in database, save url
        if (urlRegex.test(urlString)) {
          let url = new Url( {url: urlString} );
          url.save(function (err) {
            if (err) {
              console.log(err.message);
            } else {
              res.json({
                url: url.url,
                urlId: url.urlId,
                _id: url._id
              });
            }
          });
        } else {
          res.json({error: "Wrong url format, make sure you have a valid protocol and real site."});
        }
      }
    }
  });
})
.get(/\/(\d)/, function (req, res) {
  let id = req.params[0];
  Url.findOne({ urlId: id }, function (err, result) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      if (! result) {
        res.json({ error: "This index does not match any existing URL." });
      } else {
        res.redirect(result.url);
      }
    }
  });
});

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
