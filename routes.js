"use strict"
const express = require('express'),
      routes = express.Router(),
      mongoose = require('mongoose'),
      Url = require('./Url');

routes
.get(/\/new\/(.+)/, function (req, res) {
  let urlRegex = /^https?:\/\/(\w+\.)+\w+/,
      urlString = req.params[0];
  Url.findOne({ url: urlString }, function (err, result) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      if (result) {
        let shortUrl = req.protocol + '://' + req.get('host') + '/' + result.urlId
        // send the result if the url exists in database
        res.json({
          url: result.url,
          shortUrl: shortUrl
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
                shortUrl: req.protocol + '://' + req.get('host') + '/' + url.urlId
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

module.exports = routes;