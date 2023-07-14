const writeToFile = require("../util/write-to-file");

module.exports = (req, res) => {
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
    let index = req.movies.findIndex((movie) => {
      return movie.id === id;
    });

    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Not Found",
          message: "Movie not found",
        })
      );
    } else {
      req.movies.splice(index, 1);
      writeToFile(req.movies);
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.movies));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not Found" }));
  }
};
