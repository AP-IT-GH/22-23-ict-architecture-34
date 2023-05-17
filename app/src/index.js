const express = require("express");
const apiRoute = require("./api.route");

const app = express();

app.use("/api", apiRoute);

app.use(express.static("public"));

app.listen(80, () => {
  console.log("Upload app listening on port 80!");
});
