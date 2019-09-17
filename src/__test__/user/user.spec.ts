import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { sequelize } from "../../services/sequelize";
import { User } from "../../models/User.model";

const UserModel = sequelize.models.User;

describe("user query", () => {
  it("returns null on user not found", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.user("user-çaçafijçadfivj");
    expect(response.data.user).toBeNull();
  });
  it("returns user data on query", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const user = (await UserModel.create({
      email,
      name,
      password
    })) as User;
    const response = await client.user(`user-${user._id}`);
    expect(response.data.user).not.toBeNull();
    expect(response.data.user._id).toEqual(user._id);
  });
});
