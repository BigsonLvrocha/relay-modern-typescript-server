import "dotenv/config";
import { Dialect } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";

const options: SequelizeOptions = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || undefined,
  database:
    process.env.NODE_ENV !== "test"
      ? process.env.DB_DATABASE || "relay_modern_development"
      : "relay_modern_test",
  host:
    process.env.DB_HOSTNAME ||
    (process.env.NODE_ENV === "test" ? "0.0.0.0" : "db"),
  port: Number.parseInt(process.env.DB_PORT || "5432", 10),
  dialect: (process.env.DB_DIALECT as Dialect) || "postgres",
  logging: process.env.NODE_ENV !== "test" ? console.log : false
};

export default options;
