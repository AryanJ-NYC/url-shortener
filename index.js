"use strict"
const express = require('express'),
      app = express(),
      portNumber = process.env.PORT || process.argv[2] || 8080;

app
.get(/new\/(.+)/, function (req, res) {
  let urlRegex = /^https?:\/\/(\w+\.)+\w+/,
      url = req.params[0];
  if (urlRegex.test(url)) {
    res.send("Matched");
  } else {
    res.json({error: "Wrong url format, make sure you have a valid protocol and real site."});
  }
})
.get('/:id', function (req, res) {

});

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
