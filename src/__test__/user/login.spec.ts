import { sequelize } from "../../services/sequelize";
import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { User } from "../../models/User.model";
import * as jwt from "jsonwebtoken";
import * as tp from "typed-promisify";
import { invalidLogin } from "../../modules/user/types/errorMessages";

const verify = tp.promisify(jwt.verify);

describe("login mutation", () => {
  it("logs valid user", async () => {
    const UserModel = sequelize.models.User;
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const user = (await UserModel.create({
      email,
      password,
      name
    })) as User;
    const response = await client.login(email, password);
    expect(response.data.UserLoginWithEmail).not.toBeNull();
    expect(response.data.UserLoginWithEmail.error).toBeNull();
    expect(response.data.UserLoginWithEmail.token).not.toBeNull();
    const { userId } = (await verify(
      response.data.UserLoginWithEmail.token,
      process.env.APP_SECRET || "secret"
    )) as any;
    expect(userId).toEqual(user._id);
  });

  it("returns error on wrong password", async () => {
    const UserModel = sequelize.models.User;
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    await UserModel.create({
      email,
      password,
      name
    });
    const response = await client.login(
      email,
      "wrong passwordlausidhf apçshfç"
    );
    expect(response.data.UserLoginWithEmail).not.toBeNull();
    expect(response.data.UserLoginWithEmail.error).not.toBeNull();
    expect(response.data.UserLoginWithEmail.token).toBeNull();
    expect(response.data.UserLoginWithEmail.error).toEqual(invalidLogin);
  });

  it("returns error on invalid email", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.login(
      "lgliugliug",
      "wrong passwordlausidhf apçshfç"
    );
    expect(response.data.UserLoginWithEmail).not.toBeNull();
    expect(response.data.UserLoginWithEmail.error).not.toBeNull();
    expect(response.data.UserLoginWithEmail.token).toBeNull();

    expect(response.data.UserLoginWithEmail.error).toEqual(invalidLogin);
  });
});
