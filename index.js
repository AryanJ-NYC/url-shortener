"use strict"
const express = require('express'),
      app = express(),
      portNumber = process.env.PORT || process.argv[2] || 8080;

app
.get('/new/:url', function (req, res) {

})
.get('/:id', function (req, res) {

});

app.listen(portNumber);