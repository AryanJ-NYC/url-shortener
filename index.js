"use strict";
const express = require('express'),
      app = express(),
      routes = require('./routes'),
      portNumber = process.env.PORT || process.argv[2] || 8080;

app.use('/', routes);

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
