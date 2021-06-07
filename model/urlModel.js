let mongoose = require("mongoose");

let urlSchema = new mongoose.Schema({
  givenUrl: {
    type: String,
    required: true,
    unique: true,
  },
  newUrl: {
    type: String,
    required: true,
    unique: true,
  },
});

let UrlModel = new mongoose.model("url", urlSchema);
module.exports = { UrlModel };
