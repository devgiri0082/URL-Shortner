let http = require("http");
let fs = require("fs");
let mongoose = require("mongoose");
let {
  shortenTheUrl,
  shortUrl,
  longUrl,
} = require("./Controller/urlController");

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/url", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();
let server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return;
  if (req.url === "/") {
    res.setHeader("Content-type", "text/html");
    res.statusCode = 201;
    fs.readFile(`./Views/index.html`, "utf8", (err, data) => {
      if (err) {
        console.log("error: ", err);
        res.write("Server Error");
        res.end();
      }
      res.write(data);
      res.end();
    });
  } else if (req.url === "/style.css") {
    res.setHeader("Content-type", "text/html");
    res.statusCode = 201;
    fs.readFile(`./Views/style.css`, "utf8", (err, data) => {
      if (err) {
        console.log("error: ", err);
        res.write("Server Error");
        res.end();
      }
      res.write(data);
      res.end();
    });
  } else if (req.method === "POST") {
    req.on("data", async (data) => {
      let givenUrl = decodeURIComponent(data.toString()).split("=")[1];
      console.log(givenUrl);
      await shortenTheUrl(givenUrl);
      let currentUrl = givenUrl;
      let newUrl = await shortUrl(givenUrl);
      console.log(newUrl);
      res.setHeader("Content-type", "text/html");
      res.statusCode = 201;
      fs.readFile(`./Views/shortUrl.html`, "utf8", (err, data) => {
        if (err) {
          console.log("error: ", err);
          res.write("Server Error");
          res.end();
        }
        data = data.replace("$$prevUrl", currentUrl);
        data = data.replace("$$newUrl", `http://localhost:3000/${newUrl}`);
        res.write(data);
        res.end();
      });
    });
  } else {
    console.log(req.url);
    let data = await longUrl(req.url.slice(1));
    console.log(data);
    if (data) {
      res.writeHead(301, { Location: data.givenUrl });
      res.end();
    } else {
      res.setHeader("Content-type", "text/html");
      res.statusCode = 404;
      fs.readFile(`./Views/pageNotFound.html`, "utf8", (err, data) => {
        if (err) {
          console.log("error: ", err);
          res.write("Server Error");
          res.end();
        }
        res.write(data);
        res.end();
      });
    }
  }
});

server.listen(3000, "localhost", () => {
  console.log("listening to port 3000");
});

function showPage(req, res, currentUrl = "", newUrl = "") {
  console.log(currentUrl, newUrl);
  let pages = {
    "/": "index.html",
    "/shorten-link": "shortUrl.html",
    "/style.css": "style.css",
  };
  let goTo = "pageNotFound.html";
  let statusCode = 404;
  if (req.url in pages) {
    goTo = pages[req.url];
    statusCode = 201;
  }
  res.setHeader("Content-type", "text/html");
  res.statusCode = statusCode;
  fs.readFile(`./Views/${goTo}`, "utf8", (err, data) => {
    if (err) {
      console.log("error: ", err);
      res.write("Server Error");
      res.end();
    }
    res.write(data);
    res.end();
  });
}
