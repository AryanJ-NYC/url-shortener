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
urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: 'urlId', startAt: 1 });
let Url = db.model('Url', urlSchema);

app
.get(/new\/(.+)/, function (req, res) {
  let urlRegex = /^https?:\/\/(\w+\.)+\w+/,
      urlString = req.params[0];
  if (urlRegex.test(urlString)) {
    let url = new Url({ url: urlString });
    url.save(function (err) {
      if (err) {
        console.log(err.message);
      } else {
        res.send(url);
      }
    });
  } else {
    res.json({error: "Wrong url format, make sure you have a valid protocol and real site."});
  }
})
.get('/:id', function (req, res) {

});

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
