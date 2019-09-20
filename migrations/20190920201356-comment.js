"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("comments", {
      _id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      authorId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "_id"
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      postId: {
        type: Sequelize.UUID,
        references: {
          model: "posts",
          key: "_id"
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("comments");
  }
};
