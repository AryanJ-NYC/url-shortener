const mongoose = require('mongoose'),
      mongoUrl = process.env.MONGODB_URI || ('mongodb://localhost:27017');

mongoose.connect(mongoUrl);
module.exports = mongoose.connection;