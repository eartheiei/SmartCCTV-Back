const express = require("express");
const searchs = express.Router();
const cors = require("cors");
const { Op } = require("sequelize");

const Search = require("../models/Search");
const Area = require("../models/Area");
const Member = require("../models/Member");
searchs.use(cors());

searchs.post("/add", (req, res) => {
  const date = new Date();
  const time = date.getTime();

  req.body.forEach(element => {
    const searchData = {
      user_id: element.user_id,
      block_id: element.block_id,
      area_id: element.area_id,
      cam_id: element.cam_id,
      video_name: element.video_name,
      date: date,
      time: time
    };

    Search.create(searchData)
      .then(search => {
        res.send("Success!");
      })
      .catch(err => {
        res.send("error: " + err);
      });
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

// const database = {
//   user_id: element.user_id,
//   block_id: element.block_id,
//   area_id: element.area_id,
//   cam_id: element.cam_id,
//   video_name: element.video_name,
//   date: date,
//   time: time
// };

// const search = {
//   name: this.state.name,
//   picture: this.state.picture,
//   areaName: this.state.areaName,
//   camera: this.state.camera,
//   date: this.state.date,
//   time: this.state.time
// };

searchs.post("/video", (req, res) => {
  Area.findOne({
    where: {
      area_name: req.body.areaName
    }
  })
    .then(area_found => {
      Member.findOne({
        where: {
          name: req.body.name
        }
      })
        .then(member_found => {
          Search.findAll({
            where: {
              [Op.and]: [
                member_found ? { user_id: member_found.user_id } : {},
                area_found ? { area_id: area_found.area_id } : {},
                req.body.camera ? { cam_id: req.body.camera } : {},
                req.body.date ? { date: req.body.date } : {},
                req.body.time ? { time: req.body.time } : {}
              ]
            }
          })
            .then(result => {
              if (result) {
                res.send(result);
              }
            })
            .catch(err => {
              res.status(400).json({ error: err });
            });
        })
        .catch(err => {
          res.status(400).json({ error: err });
        });
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

module.exports = searchs;
