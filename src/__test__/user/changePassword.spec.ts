import { sequelize } from "../../services/sequelize";
import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { User } from "../../models/User.model";
import { invalidLogin } from "../../modules/user/types/errorMessages";

describe("change password", () => {
  it("changes password", async () => {
    const UserModel = sequelize.models.User;
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const password2 = faker.internet.password();
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
    const response = await client.changePassword(password, password2, token);
    expect(response.data.UserChangePassword).not.toBeNull();
    expect(response.data.UserChangePassword.error).toBeNull();
    expect(response.data.UserChangePassword.me._id).toEqual(user._id);
    await user.reload();
    expect(user.password).not.toEqual(password2);
    const responseLogin = await client.login(email, password2);
    expect(responseLogin.data.UserLoginWithEmail).not.toBeNull();
    expect(responseLogin.data.UserLoginWithEmail.error).toBeNull();
    expect(responseLogin.data.UserLoginWithEmail.token).not.toBeNull();
  });

  it("fails on old password", async () => {
    const UserModel = sequelize.models.User;
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const password2 = faker.internet.password();
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
    const response = await client.changePassword(password, password2, token);
    expect(response.data.UserChangePassword).not.toBeNull();
    expect(response.data.UserChangePassword.error).toBeNull();
    expect(response.data.UserChangePassword.me._id).toEqual(user._id);
    const responseLogin = await client.login(email, password);
    expect(responseLogin.data.UserLoginWithEmail).not.toBeNull();
    expect(responseLogin.data.UserLoginWithEmail.error).toEqual(invalidLogin);
    expect(responseLogin.data.UserLoginWithEmail.token).toBeNull();
  });
});
