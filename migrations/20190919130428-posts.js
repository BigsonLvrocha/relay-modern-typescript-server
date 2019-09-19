"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("posts", {
      _id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNul: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNul: false
      },
      title: {
        type: Sequelize.STRING,
        allowNul: false
      },
      description: Sequelize.STRING,
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "_id"
        },
        allowNul: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("posts");
  }
};
