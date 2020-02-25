const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "area",
  {
    area_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    area_name: {
      type: Sequelize.STRING
    },
    detail: {
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
