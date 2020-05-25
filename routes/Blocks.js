const express = require("express");
const blocks = express.Router();
const cors = require("cors");

const Block = require("../models/Block");
blocks.use(cors());

blocks.post("/add", (req, res) => {
  const blockData = {
    area_name: req.body.area_name,
    size: req.body.size,
    realRow: req.body.realRow,
    realColumn: req.body.realColumn,
    pixelRow: req.body.pixelRow,
    pixelColumn: req.body.pixelColumn,
    cam_id: req.body.cam_id,
    block_num: req.body.block_num,
  };

  Block.findOne({
    where: {
      area_name: req.body.area_name,
      realRow: req.body.realRow,
      realColumn: req.body.realColumn,
      cam_id: req.body.cam_id,
    },
  })
    .then((block) => {
      if (!block) {
        Block.create(blockData)
          .then((block) => {
            res.json({
              status: block.realRow + block.realColumn + " Registered!",
            });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "Block already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

blocks.get("/all", (req, res) => {
  Block.findAll()
    .then((blocks) => {
      if (blocks) {
        res.send(blocks);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

blocks.get("/check/block_num/:block_id", (req, res) => {
  console.log('------------------------------test')
  const block_id = req.params.block_id;
  Block.findOne({
    where: {
      block_id: block_id,
    },
  }).then((result) => {
    return res.send(result)
  });
});

module.exports = blocks;
