const express = require("express");
const members = express.Router();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const Members = require("../models/Member");
members.use(cors());

var previous_member_user_id = "";
var new_member_user_id = "";

function decode_base64(base64str, filename) {
  var buf = Buffer.from(base64str, "base64");

  fs.writeFile(
    path.join(process.cwd(), "/uploads/members/", filename),
    buf,
    function(error) {
      if (error) {
        return error;
      } else {
        return true;
      }
    }
  );
}

members.post("/add", (req, res) => {
  const file = req.body.picture;
  const path = `/uploads/members/${req.body.user_id}`;

  file.forEach((element, index) => {
    decode_base64(element, `${req.body.user_id}_${index + 1}.png`);
  });

  const memberData = {
    user_id: req.body.user_id,
    name: req.body.name,
    path: path
  };

  Members.findOne({
    where: {
      user_id: req.body.user_id
    }
  })
    .then(member => {
      if (!member) {
        Members.create(memberData)
          .then(member => {
            new_member_user_id = member.user_id;
            res.json({ status: member.user_id + " Add!" });
          })
          .catch(err => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "User id already exists" });
      }
    })
    .catch(err => {
      res.send("error: " + err);
    });
});

members.get("/get", (req, res) => {
  Members.findAll()
    .then(members => {
      if (members) {
        res.send(members);
      }
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

//////////////////////////////////////////////////////
function Image2base64(filePath) {
  var base64Array = [];
  for (var i = 0; i < 5; i++) {
    const base64 = fs.readFileSync(`${filePath}_${i + 1}.png`, "base64");
    base64Array.push(base64);
  }
  return base64Array;
}

members.get("/face/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const filePath = `${process.cwd()}/uploads/members/${user_id}`;
  var result = [],
    temp = Image2base64(filePath);
  result = [
    {
      user_id: user_id,
      picture: temp
    }
  ];
  if (result) {
    return res.send(result);
  } else return res.send("not work!");
});

members.get("/newMember", (req, res) => {
  if (previous_member_user_id != new_member_user_id) {
    if (new_member_user_id != "") {
      previous_member_user_id = new_member_user_id;
      temp = {
        user_id: new_member_user_id
      }
      return res.send(temp);
    }
  } else return res.send(null);
});

module.exports = members;
