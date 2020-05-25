const express = require("express");
const searchs = express.Router();
const cors = require("cors");
const { Op } = require("sequelize");
const multer = require("multer");
const fs = require("fs");
const csv = require("fast-csv");
const path = require("path");

const Search = require("../models/Search");
const Area = require("../models/Area");
const Member = require("../models/Member");
const Block = require("../models/Block");
searchs.use(cors());

var upload_file_name = "";
var previous_upload_file_name = "";
var result_tier = [];

///////////////////// add result video from process server /////////////////////
searchs.post("/add", (req, res) => {
  req.body.forEach((element) => {
    Area.findOne({
      where: {
        area_name: element.area_name,
      },
    }).then((result) => {
      const searchData = {
        user_id: element.user_id,
        block_id: element.block_id,
        area_id: result.area_id,
        cam_id: element.cam_id,
        video_name: element.video_name,
        date: element.date,
        time: element.time,
        width: element.width,
        height: element.height,
        x: element.x,
        y: element.y,
      };
      Search.create(searchData);
    });
  });
  res.send("Success!");
});

////////////////////// add csv ////////////////////
var storageCSV = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/realposition");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var uploadCSV = multer({ storage: storageCSV }).single("file");

searchs.post("/add/csv", function (req, res) {
  uploadCSV(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    importCsvData2MySQL(
      process.cwd() + "/uploads/realposition/" + req.file.filename
    );
    return res.status(200).send(req.file);
  });
});

function importCsvData2MySQL(filePath) {
  let stream = fs.createReadStream(filePath);
  let csvData = [];
  let csvStream = csv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // Remove Header ROW
      csvData.shift();

      // Create a connection to the database
      csvData.map((row) => {
        Area.findOne({
          where: {
            area_name: row[2],
          },
        }).then((result) => {
          const searchData = {
            user_id: row[0],
            block_id: row[1],
            area_id: result.area_id,
            cam_id: row[3],
            video_name: row[4],
            date: row[5],
            time: row[6],
            width: row[9],
            height: row[10],
            x: row[7],
            y: row[8],
          };
          Search.create(searchData);
        });
      });

      // delete file after saving to MySQL database
      // -> you can comment the statement to see the uploaded CSV file.
      // fs.unlinkSync(filePath)
    });

  stream.pipe(csvStream);
}

///////////////////// get all /////////////////////
searchs.get("/all", (req, res) => {
  Search.findAll()
    .then((result) => {
      if (result) {
        res.send(result);
      }
    })
    .catch((err) => {
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
    .catch((err) => {
      res.send("error: " + err);
    });
});

///////////////////// search video /////////////////////
searchs.post("/video", (req, res) => {
  const timeStart = req.body.timeStart.split(":");
  const timeEnd = req.body.timeEnd.split(":");
  if(timeEnd[1]==='00')timeEnd[1]='60'
  Area.findOne({
    where: {
      area_name: req.body.areaName,
    },
  })
    .then((area_found) => {
      Member.findOne({
        where: {
          name: req.body.name,
        },
      })
        .then((member_found) => {
          Search.findAll({
            where: {
              [Op.and]: [
                member_found ? { user_id: member_found.user_id } : {},
                req.body.user_id ? { user_id: req.body.user_id } : {},
                area_found ? { area_id: area_found.area_id } : {},
                req.body.camera ? { cam_id: req.body.camera } : {},
                req.body.date ? { date: req.body.date } : {},
              ],
            },
            group: ["video_name"],
          })
            .then((result) => {
              if (result) {
                var temp = [];
                if (timeStart[0] !== "" && timeEnd[0] !== "") {
                  result.map((video) => {
                    const timeCheck = video.dataValues.time.split(":");
                    console.log(timeCheck, timeStart, timeEnd);
                    if (
                      parseInt(timeCheck[0]) >= parseInt(timeStart[0]) &&
                      parseInt(timeCheck[0]) <= parseInt(timeEnd[0])
                    ) {
                      if (
                        parseInt(timeCheck[1]) >= parseInt(timeStart[1]) 
                        && parseInt(timeCheck[1]) <= parseInt(timeEnd[1])
                      ) {
                        temp.push(video.dataValues);
                      }
                    }
                  });
                  res.send(temp);
                } else res.send(result);
              }
            })
            .catch((err) => {
              res.status(400).json({ error: err });
            });
        })
        .catch((err) => {
          res.status(400).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

///////////////////// Upload picture search /////////////////////
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/searchs/verify");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    upload_file_name = `${file.originalname}`;
  },
});
var upload = multer({ storage: storage }).single("file");

searchs.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

///////////////////// Upload video /////////////////////
var storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/searchs/video");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var uploadVideo = multer({ storage: storageVideo }).single("file");

searchs.post("/uploadVideo", function (req, res) {
  uploadVideo(req, res, function (err) {
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
  const filePath = `${process.cwd()}/uploads/searchs/verify/${upload_file_name}`;
  result_tier = [];
  if (previous_upload_file_name != upload_file_name) {
    previous_upload_file_name = upload_file_name;
    fs.exists(filePath, (exists) => {
      if (exists && upload_file_name != "") {
        const base64 = fs.readFileSync(filePath, "base64");
        var result = [
          {
            picture: base64,
          },
        ];
        return res.send(result);
      } else return res.send(null);
    });
  } else return res.send(null);
});

///////////////////// get result search picture /////////////////////
searchs.post("/resultVerify", (req, res) => {
  const tier = [req.body.tier1, req.body.tier2, req.body.tier3];
  result_tier = tier;
  console.log(result_tier);
  if (result_tier.length > 0) return res.send("success!");
  return res.send("not work!");
});

/////////////////////////web front /////////////////////////////
searchs.get("/tierVerify", (req, res) => {
  const tierBase64 = [];
  if (result_tier.length > 0) {
    result_tier.map((id) => {
      const filePath = `${process.cwd()}/uploads/members/${id}`;
      const base64 = fs.readFileSync(`${filePath}_1.png`, "base64");
      tierBase64.push({
        id: id,
        base64: base64,
      });
    });
    return res.send(tierBase64);
  } else return res.send([]);
});

///////////////////////// mapping search /////////////////////////////
searchs.get("/mapping/:user_id/:video_name", (req, res) => {
  const user_id = req.params.user_id;
  const video_name = req.params.video_name;
  Search.findAll({
    where: {
      [Op.and]: [{ user_id: user_id }, { video_name: video_name }],
    },
    // attributes: ["block_id"],
  }).then((result) => {
    return res.send(result)
  });
});

////////////////////////recieves unknown//////////////////////
function decode_base64(base64str, filename) {
  var buf = Buffer.from(base64str, "base64");

  fs.writeFile(
    path.join(process.cwd(), "/uploads/searchs/unknown", filename),
    buf,
    function (error) {
      if (error) {
        return error;
      } else {
        return true;
      }
    }
  );
}

searchs.post("/unknown", (req, res) => {
  const unknown_id = req.body.user_id;
  const base64 = req.body.picture;
  decode_base64(base64, `${unknown_id}.png`);
  return res.send("created!");
});

module.exports = searchs;
