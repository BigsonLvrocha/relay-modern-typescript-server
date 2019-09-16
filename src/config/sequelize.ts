import "dotenv/config";
import { Dialect } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";

const options: SequelizeOptions = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || undefined,
  database:
    process.env.NODE_ENV !== "test"
      ? process.env.DB_DATABASE || undefined
      : "relay_modern_test",
  host: process.env.DB_HOSTNAME || "127.0.0.1",
  port: Number.parseInt(process.env.DB_PORT || "5432", 10),
  dialect: (process.env.DB_DIALECT as Dialect) || "postgres",
  logging:
    (process.env.DB_LOGGING as string) === "true" ||
    process.env.NODE_ENV !== "test"
};

export default options;
