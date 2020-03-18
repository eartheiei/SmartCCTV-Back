const express = require("express");
const searchs = express.Router();
const cors = require("cors");
const { Op } = require("sequelize");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const image2base64 = require("image-to-base64");

const Search = require("../models/Search");
const Area = require("../models/Area");
const Member = require("../models/Member");
searchs.use(cors());

var upload_file_name = "";
var previous_upload_file_name = "";
var result_tier = []

///////////////////// add result video from process server /////////////////////
searchs.post("/add", (req, res) => {
  req.body.forEach(element => {
    Area.findOne({
      where: {
        area_name: element.area_name
      }
    }).then(result => {
      const searchData = {
        user_id: element.user_id,
        block_id: element.block_id,
        area_id: result.area_id,
        cam_id: element.cam_id,
        video_name: element.video_name,
        date: element.date,
        time: element.time
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
});

///////////////////// get all /////////////////////
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

///////////////////// update id - re-id /////////////////////
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

///////////////////// search video /////////////////////
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
            },
            // group: ['video_name']
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

///////////////////// Upload picture search /////////////////////
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.cwd() + "/uploads/searchs/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
    upload_file_name = `${file.originalname}`;
  }
});
var upload = multer({ storage: storage }).single("file");

searchs.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

///////////////////// Upload picture search /////////////////////
var storageVideo = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.cwd() + "/uploads/searchs/video");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var uploadVideo = multer({ storage: storageVideo }).single("file");

searchs.post("/uploadVideo", function(req, res) {
  uploadVideo(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

///////////////////// get new picture search /////////////////////
searchs.get("/faceVerify", (req, res) => {
  const filePath = `${process.cwd()}/uploads/serachs/${upload_file_name}`;
  if (previous_upload_file_name != upload_file_name) {
    previous_upload_file_name = upload_file_name;
    fs.exists(filePath, exists => {
      if (exists && upload_file_name != "") {
        const base64 = fs.readFileSync(filePath, "base64");
        var result = [
          {
            picture: base64
          }
        ];
        return res.send(result);
      } else return res.send(null);
    });
  } else return res.send(null);
});

///////////////////// get result search picture /////////////////////
searchs.post("/resultVerify", (req, res) => {
  const tier = [req.body.tier1, req.body.tier2, req.body.tier3];
  result_tier = tier
  console.log(result_tier)
  if(result_tier.length>0)return res.send('success!')
  return res.send('not work!')
});

/////////////////////////web front /////////////////////////////
searchs.get('/tierVerify', (req,res) => {
  if(result_tier.length>0){
    return res.send(result_tier)
  }else return res.send('nothing')
})

////////////////////////recieves unknown//////////////////////
function decode_base64(base64str, filename) {
  var buf = Buffer.from(base64str, "base64");

  fs.writeFile(
    path.join(process.cwd(), "/uploads/searchs/unknown", filename),
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

searchs.post('/unknown', (req,res) => {
  const unknown_id = req.body.user_id
  const base64 = req.body.picture
  decode_base64(base64, `${unknown_id}.png`);
  return res.send('created!')
})


module.exports = searchs;
