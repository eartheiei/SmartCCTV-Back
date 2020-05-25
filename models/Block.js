const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "block",
  {
    block_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    area_name: {
      type: Sequelize.STRING
    },
    size: {
      type: Sequelize.INTEGER
    },
    realRow: {
      type: Sequelize.INTEGER
    },
    realColumn: {
      type: Sequelize.INTEGER
    },
    pixelRow: {
      type: Sequelize.INTEGER
    },
    pixelColumn: {
      type: Sequelize.INTEGER
    },
    cam_id: {
      type: Sequelize.INTEGER
    },
    block_num: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
);
