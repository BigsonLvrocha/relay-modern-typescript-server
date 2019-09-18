"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      _id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      password: Sequelize.STRING,
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      active: Sequelize.BOOLEAN
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
