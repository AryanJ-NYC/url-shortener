const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      db = require('./database')
      autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(db);

let urlSchema = new Schema({
  url : { type: String, index : { unique : true } }
});
urlSchema.index({ url: 1 });
urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: 'urlId', startAt: 1 });
let Url = db.model('Url', urlSchema);

module.exports = Url;