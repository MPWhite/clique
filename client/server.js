const path = require("path");
const express = require("express");
const request = require("request");
const app = express();
const port = Number(process.env.PORT) || 3001; // read process.env.PORT from heroku environment

app.use(express.static(path.join(__dirname, "build"))); // here we serve all the statics

app.use("/api", function (req, res) {
  const url = "https://clique-be.herokuapp.com/api/" + req.url;
  req.pipe(request({ qs: req.query, uri: url })).pipe(res);
});

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Up and  running on http://localhost:${port}`);
});
