import { default as Server } from "../../server";
import { AddressInfo } from "net";
import { sequelize } from "../../services/sequelize";
import { Cors } from "../../config/cors";

export default async function setup() {
  const app = await Server.start({
    cors: Cors,
    port: 0
  });
  const { port } = app.address() as AddressInfo;
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
  console.log(process.env.TEST_HOST);
  const UserModel = sequelize.models.User;
  await UserModel.truncate();
}
