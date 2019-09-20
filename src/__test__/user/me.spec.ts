import { TestClient } from "../util/testClient";
import { sequelize } from "../../services/sequelize";
import * as faker from "faker";
import { User } from "../../models/User.model";

describe("me query", () => {
  it("returns null on unauthenticated", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.me("aoçsdhfçqeori");
    expect(response.data.me).toBeNull();
    expect(response.errors).not.toBeNull();
  });

  it("returns me on authenticated", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const UserModel = sequelize.models.User;
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const user = (await UserModel.create({
      email,
      password,
      name
    })) as User;
    const {
      data: {
        UserLoginWithEmail: { token }
      }
    } = await client.login(email, password);
    const response = await client.me(token);
    expect(response.data.me).not.toBeNull();
    expect(response.data.me._id).toEqual(user._id);
    expect(response.data.me._id).toEqual(user._id);
    expect(response.data.me.name).toEqual(user.name);
  });
});
