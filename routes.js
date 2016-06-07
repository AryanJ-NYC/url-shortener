"use strict";
const routes = require('express').Router(),
      Url = require('./Url');

routes
.get(/\/new\/(https?:\/\/(\w+\.)+\w+)/, function (req, res) {
  let urlString = req.params[0];
  Url.findOne({ url: urlString }, function (err, result) {
    if (err) {
      console.error(err.message);
      res.json({ error: "Error searching for URL in database." })
    } else {
      if (result) {
      // if result in database, lookup and respond with shortUrl
        let shortUrl = req.protocol + '://' + req.get('host') + '/' + result.urlId;
        // send the result if the url exists in database
        res.json({
          url: result.url,
          shortUrl: shortUrl
        });
      } else {
      // if not found in database, save url
        let url = new Url({ url: urlString });
        url.save(function (err) {
          if (err) {
            console.error(err.message);
            res.json({ error: "Error saving URL to database." });
          } else {
            res.json({
              url: url.url,
              shortUrl: req.protocol + '://' + req.get('host') + '/' + url.urlId
            });
          }
        });
      }
    }
  });
})
.get(/\/new\/.*/, function (req, res) {
  res.json({ error: "URL is not valid or does not begin with http:// or https://" });
})
.get(/\/(\d+)/, function (req, res) {
  let id = req.params[0];
  Url.findOne({ urlId: id }, function (err, result) {
    if (err) {
      console.error(err.message);
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
  let html =
  `<h1>URL Shortener</h1>
  <h2>Create a new shortened URL</h2>
  <p>Go to <code>http://${req.hostname}/new/http://www.example.com</code>
  </br>where www.example.com is any url you'd like to shorten.
  <p><code>http://</code> or <code>https://</code> MUST be included.</p>`;
  res.send(html);
});

module.exports = routes;
