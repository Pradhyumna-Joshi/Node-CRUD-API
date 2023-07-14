const bodyParser = require("../util/body-parser");
const writeToFile = require("../util/write-to-file");

module.exports = async (req, res) => {
  const baseURL = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  const id = req.url.split("/")[3];
  const regexV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  if (!regexV4.test(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "UUID is invalid",
      })
    );
  } else if (regexV4.test(id) && baseURL === "/api/movies/") {
    try {
      let index = req.movies.findIndex((movie) => {
        return movie.id === id;
      });

      let body = await bodyParser(req);
      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "Not Found",
            message: "Movie not found",
          })
        );
      } else {
        req.movies[index] = { id, ...body };
        writeToFile(req.movies);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(req.movies[index]));
      }
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
