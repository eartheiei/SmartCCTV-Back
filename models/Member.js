const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "member",
  {
    mem_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.STRING
    },
    face: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
);
