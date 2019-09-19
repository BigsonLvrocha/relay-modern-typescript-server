"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const update1 = queryInterface.bulkUpdate(
      "users",
      {
        active: false
      },
      {
        active: null
      }
    );
    const update2 = queryInterface.bulkUpdate(
      "users",
      {
        name: ""
      },
      {
        name: null
      }
    );
    return Promise.all([update1, update2]).then(() => {
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
      return Promise.all([promise1, promise2]);
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
    return Promise.all([promise1, promise2]);
  }
};
