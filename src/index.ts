import "reflect-metadata";
import "dotenv/config";
import { default as Server } from "./server";
import { Cors as cors } from "./config/cors";

const port = process.env.PORT || "5555";
Server.start({
  cors,
  port
}).then(() => {
  console.log("app is running on port ");
});
