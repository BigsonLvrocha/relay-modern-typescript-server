"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("posts", "description", Sequelize.TEXT);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      "posts",
      "description",
      Sequelize.STRING
    );
  }
};
