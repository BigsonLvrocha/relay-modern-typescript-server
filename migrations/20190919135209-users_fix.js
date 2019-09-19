"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete(
        "users",
        {},
        {
          truncate: true,
          cascade: true
        }
      )
      .then(() => {
        const promise1 = queryInterface.changeColumn("users", "name", {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        });
        const promise2 = queryInterface.changeColumn("users", "active", {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
        const promise3 = queryInterface.changeColumn("users", "email", {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        });
        return Promise.all([promise1, promise2, promise3]);
      });
  },

  down: (queryInterface, Sequelize) => {
    const promise1 = queryInterface.changeColumn("users", "name", {
      type: Sequelize.STRING,
      unique: true
    });

    const promise2 = queryInterface.changeColumn("users", "active", {
      type: Sequelize.BOOLEAN
    });
    const promise3 = queryInterface.changeColumn("users", "email", {
      type: Sequelize.BOOLEAN,
      type: Sequelize.STRING,
      allowNull: false
    });
    return Promise.all([promise1, promise2, promise3]);
  }
};
