const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("go to /members to see members");
});

var Members = require("./routes/Members");
app.use("/members", Members);

var Users = require("./routes/Users");
app.use("/users", Users);

var Settings = require("./routes/Settings");
app.use("/settings", Settings);

var Blocks = require("./routes/Blocks");
app.use("/blocks", Blocks);

var Searchs = require("./routes/Searchs");
app.use("/search", Searchs);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
