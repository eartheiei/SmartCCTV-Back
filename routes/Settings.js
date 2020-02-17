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
    created: today
  };

  Setting.findOne({
    where: {
      ip: req.body.ip
    }
  })
    .then(setting => {
      if (!setting) {
        Setting.create(settingData)
          .then(setting => {
            res.json({ status: setting.ip + " Registered!" });
          })
          .catch(err => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "Ip already exists" });
      }
    })
    .catch(err => {
      res.send("error: " + err);
    });
});


settings.get("/cameras", (req,res)=>{
    Setting.findAll().then(cameras => {
        if(cameras){
            res.send(cameras)
        }
    })
    .catch(err => {
        res.status(400).json({ error: err });
      });
})

module.exports = settings