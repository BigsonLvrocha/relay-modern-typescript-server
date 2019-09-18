import { Sequelize } from "sequelize-typescript";
import { default as Config } from "../config/sequelize";

const sequelize = new Sequelize({
  ...Config,
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf(".model")) === member;
  },
  models: [__dirname + "/../models/**/*.model.ts"]
});

export { sequelize };
