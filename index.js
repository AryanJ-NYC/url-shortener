"use strict"
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      portNumber = process.env.PORT || process.argv[2] || 8080,
      mongoPort = 27017,
      autoIncrement = require('mongoose-auto-increment'),
      mongoUrl = process.env.MONGODB_URI ||
          ('mongodb://localhost:' + mongoPort);

let db = mongoose.createConnection(mongoUrl);
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
        let shortUrl = `https://${req.hostname}/${result.urlId}`;
        // send the result if the url exists in database
        res.json({
          url: result.url,
          shortUrl: shortUrl
        });
      } else {
        // if not found in database, save url
        if (urlRegex.test(urlString)) {
          let url = new Url( {url: urlString} );
          console.log(url);
          url.save(function (err) {
            if (err) {
              console.log(err.message);
            } else {
              res.json({
                url: url.url,
                shortUrl: `https://${req.hostname}/${url.urlId}`
              });
            }
          });
        } else {
          res.json({error: "Wrong url format. Please use http://example.com format."});
        }
      }
    }
  });
})
.get(/\/(\d+)/, function (req, res) {
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
})
.get('*', function (req, res) {
  res.status(400);
  let html = `<h1>URL Shortener</h1>`;
  html += `<h2>Create a new shortened URL</h2>`;
  html += `<p>Go to <code>http://${req.hostname}/new/[url]</code>`;
  html += `</br>where [url] is the url you'd like to shorten, in the following format:`;
  html += `</br><code>http://www.example.com</code></p>`;
  html += `<p><code>http://</code> or <code>https://</code> MUST be included.</p>`;
  res.send(html);
});

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
