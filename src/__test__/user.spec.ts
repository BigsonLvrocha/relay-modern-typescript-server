import { sequelize } from "../services/sequelize";
import * as faker from "faker";
import { User } from "../models/User.model";

const UserModel = sequelize.models.User;

describe("Sequelize plugin", () => {
  it("creates records", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = (await UserModel.create({
      email,
      password,
      active: true
    })) as User;
    const user2 = (await UserModel.findOne({
      where: { _id: user._id }
    })) as User;
    expect(user._id).toEqual(user2._id);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("deletes records", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = (await UserModel.create({
      email,
      password,
      active: true
    })) as User;
    await user.destroy();
    const user2 = await UserModel.findOne({
      where: { _id: user._id }
    });
    expect(user2).toBeNull();
  });
});
