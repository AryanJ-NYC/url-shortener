"use strict";
const routes = require('express').Router(),
      Url = require('./Url');

routes
.get(/\/new\/(https?:\/\/(\w+\.)+\w+)/, function (req, res) {
  let urlString = req.params[0];
  Url.findOne({ url: urlString }, function (err, result) {
    if (err) {
      console.error(err.message);
      throw err;
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
  let html = `<h1>URL Shortener</h1>`;
  html += `<h2>Create a new shortened URL</h2>`;
  html += `<p>Go to <code>http://${req.hostname}/new/[url]</code>`;
  html += `</br>where [url] is the url you'd like to shorten, in the following format:`;
  html += `</br><code>http://www.example.com</code></p>`;
  html += `<p><code>http://</code> or <code>https://</code> MUST be included.</p>`;
  res.send(html);
});

module.exports = routes;