import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { sequelize } from "../../services/sequelize";
import { TestClient } from "../util/testClient";
import { User } from "../../models/User.model";
import * as tp from "typed-promisify";

const verify = tp.promisify(jwt.verify);

describe("user registration", () => {
  it("registers user with email", async () => {
    const UserModel = sequelize.models.User;
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const response = await client.register(email, password, name);
    const user = (await UserModel.findOne({ where: { email } })) as User;
    expect(user.name).toEqual(name);
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty("data");
    expect(response.data).toHaveProperty("UserRegisterWithEmail");
    expect(response.data.UserRegisterWithEmail.error).toBeNull();
    expect(response.data.UserRegisterWithEmail.token).not.toBeNull();
    const { userId } = (await verify(
      response.data.UserRegisterWithEmail.token,
      process.env.APP_SECRET || "secret"
    )) as any;
    expect(userId).toEqual(user._id);
  });
});
