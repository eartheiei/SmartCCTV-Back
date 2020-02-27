const express = require("express");
const members = express.Router();
const cors = require("cors");

const Members = require("../models/Member");
members.use(cors());

members.post("/add", (req, res) => {
  const memberData = {
    user_id: req.body.user_id,
    name: req.body.name,
    face: req.body.face
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

members.get("/get", (req,res)=>{
    Members.findAll().then(members => {
        if(members){
            res.send(members)
        }
    })
    .catch(err => {
        res.status(400).json({error: err})
    })
})

module.exports = members
