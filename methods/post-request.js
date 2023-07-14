const bodyParser = require("../util/body-parser");
const writeToFile = require("../util/write-to-file");
const crypto = require("crypto");
module.exports = async (req, res) => {
  if (req.url === "/api/movies") {
    try {
      let body = await bodyParser(req);
      body.id = crypto.randomUUID();
      req.movies.push(body);
      writeToFile(req.movies);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end();
    } catch (err) {
      console.log(err);
      res.writeToFile(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Validation Failed",
          message: "Request Body is not valid",
        })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not Found" }));
  }
};
