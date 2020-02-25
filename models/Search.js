const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "realposition",
  {
    tran_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.STRING
    },
    block_id: {
      type: Sequelize.INTEGER
    },
    area_id: {
      type: Sequelize.INTEGER
    },
    cam_id: {
      type: Sequelize.INTEGER
    },
    video_name: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    },
    time: {
      type: Sequelize.DATE
    }
  },
  {
    timestamps: false
  }
);
