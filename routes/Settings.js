const express = require("express");
const settings = express.Router();
const cors = require("cors");

const Setting = require("../models/Setting");
settings.use(cors());

settings.post("/add/camera", (req, res) => {
  const today = new Date();
  const settingData = {
    ip: req.body.ip,
    location: req.body.location,
    spec: req.body.spec,
    created: today,
  };

  Setting.findOne({
    where: {
      ip: req.body.ip,
    },
  })
    .then((setting) => {
      if (!setting) {
        Setting.create(settingData)
          .then((setting) => {
            res.json({ status: setting.ip + " Registered!" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "Ip already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

settings.get("/cameras", (req, res) => {
  Setting.findAll()
    .then((cameras) => {
      if (cameras) {
        res.send(cameras);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

settings.post("/delete", (req, res) => {
  const id = req.body.cam_id;
  Setting.destroy({
    where: {
      cam_id: id,
    },
  }).then(res.send("Success!"));
});

settings.get("/camera/:cam_id", (req, res) => {
  const cam_id = req.params.cam_id
  Setting.findOne({
    where: {
      cam_id: cam_id,
    },
  })
    .then((result) => {
      if (result) {
        res.send(result.ip);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

module.exports = settings;
