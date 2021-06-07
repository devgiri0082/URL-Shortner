let { UrlModel: Url } = require("../model/urlModel");
let { nanoid } = require("nanoid");
let shortenTheUrl = async (givenUrl) => {
  let doesExist = await Url.findOne({ givenUrl: givenUrl });
  if (!doesExist) {
    let newURL = new Url({ givenUrl: givenUrl, newUrl: nanoid(10) });
    await newURL.save();
    // console.log(newUrl, "Hello");
  }
};
let shortUrl = async (givenUrl) => {
  try {
    let data = await Url.findOne({ givenUrl: givenUrl });
    console.log(data);
    return data.newUrl;
  } catch (err) {
    console.log(err);
  }
};
let longUrl = async (givenUrl) => {
  try {
    let data = await Url.findOne({ newUrl: givenUrl });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  shortenTheUrl,
  shortUrl,
  longUrl,
};
