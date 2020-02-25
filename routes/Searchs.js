const express = require("express");
const searchs = express.Router();
const cors = require("cors");

const Search = require("../models/Search");
searchs.use(cors());

searchs.post("/add", (req, res) => {
  const date = new Date();
  const time = date.getTime();
  const searchData = {
    user_id: req.body.user_id,
    block_id: req.body.block_id,
    area_id: req.body.area_id,
    cam_id:req.body.cam_id,
    video_name: req.body.video_name,
    date: date,
    time: time
  };

  Search.create(searchData)
    .then(search => {
      res.json({ status: search.tran_id + " Add!" });
    })
    .catch(err => {
      res.send("error: " + err);
    });
});

searchs.get("/all", (req, res) => {
  Search.findAll()
    .then(result => {
      if (result) {
        res.send(result);
      }
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

searchs.post("/update", (req, res) => {
  Search.update(
    { user_id: req.body.new_id },
    { where: { user_id: req.body.old_id } }
  )
    .then(res.send("Success"))
    .catch(err => {
      res.send("error: " + err);
    });
});

module.exports = searchs;
