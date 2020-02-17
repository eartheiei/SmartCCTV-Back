const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "setting",
  {
    cam_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    spec: {
      type: Sequelize.STRING
    },
    created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false
  }
);
