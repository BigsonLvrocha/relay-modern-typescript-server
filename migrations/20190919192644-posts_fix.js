"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("posts", ["createdAt", "authorId"], {
      type: "unique",
      name: "unique_posts_per_user"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("posts", "unique_posts_per_user");
  }
};
