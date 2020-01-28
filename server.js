const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

const SELECT_ALL_MEMBERS_QUERY = "Select * from members";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartcctv"
});

connection.connect(err => {
  if (err) {
    return err;
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("go to /members to see members");
});

app.get("/members", (req, res) => {
  connection.query(SELECT_ALL_MEMBERS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.post("/members/add", (req, res) => {
  var User_ID = req.body.User_ID;
  var Face = req.body.Face;
  var Name = req.body.Name;

  const INSERT_MEMBERS_QUERY = `INSERT INTO members (User_ID, Face, Name) VALUES('${User_ID}', '${Face}', '${Name}')`;
  if(User_ID && Name){
    connection.query(INSERT_MEMBERS_QUERY, (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Successfully added member");
      }
    });
  }
});

var Users = require('./routes/Users')

app.use('/users',Users)

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
