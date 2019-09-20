import { TestClient } from "../util/testClient";
import { ModelCtor } from "sequelize-typescript";
import { sequelize } from "../../services/sequelize";
import { User } from "../../models/User.model";
import * as faker from "faker";
import { range } from "lodash";
import { string2Cursor } from "../../util/typeMap";

const UserModel = sequelize.models.User as ModelCtor<User>;

describe("Users query", () => {
  beforeAll(async () => {
    const request = range(0, 20).map(() =>
      UserModel.create({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.internet.userName()
      })
    );
    await Promise.all(request);
  });

  it("lists first 10 on default", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.users();
    expect(response.errors).toBeUndefined();
    expect(response.data.users).not.toBeNull();
    expect(response.data.users.edges).toHaveLength(10);
  });

  it("list first 5", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const users = (await UserModel.findAll({
      order: [["name", "ASC"]],
      limit: 5,
      offset: 0
    })) as User[];
    const response = await client.users(undefined, 5);
    expect(response.errors).toBeUndefined();
    expect(response.data.users).not.toBeNull();
    expect(response.data.users.edges).toHaveLength(5);
    expect(response.data.users.edges[0].node._id).toEqual(users[0]._id);
    expect(response.data.users.edges[4].node._id).toEqual(users[4]._id);
  });

  it("list last 10", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const totalCount = await UserModel.count();
    const users = (await UserModel.findAll({
      order: [["name", "ASC"]],
      limit: 10,
      offset: totalCount - 10
    })) as User[];
    const response = await client.users(undefined, undefined, undefined, 10);
    expect(response.errors).toBeUndefined();
    expect(response.data.users).not.toBeNull();
    expect(response.data.users.edges).toHaveLength(10);
    expect(response.data.users.edges[0].node._id).toEqual(users[0]._id);
    expect(response.data.users.edges[9].node._id).toEqual(users[9]._id);
  });

  it("list first 10 after the second record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const users = (await UserModel.findAll({
      order: [["name", "ASC"]],
      limit: 13,
      offset: 0
    })) as User[];
    const afterCursor = string2Cursor(users[1].name, "user-name-");
    const response = await client.users(afterCursor);
    expect(response.errors).toBeUndefined();
    expect(response.data.users).not.toBeNull();
    expect(response.data.users.edges).toHaveLength(10);
    expect(response.data.users.edges[0].node._id).toEqual(users[2]._id);
    expect(response.data.users.edges[9].node._id).toEqual(users[11]._id);
  });
  it("list first 10 before the last record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const totalCount = await UserModel.count();
    const users = (await UserModel.findAll({
      order: [["name", "ASC"]],
      limit: 12,
      offset: totalCount - 12
    })) as User[];
    const beforeCursor = string2Cursor(users[11].name, "user-name-");
    const response = await client.users(undefined, undefined, beforeCursor, 10);
    expect(response.errors).toBeUndefined();
    expect(response.data.users).not.toBeNull();
    expect(response.data.users.edges).toHaveLength(10);
    expect(response.data.users.edges[0].node._id).toEqual(users[1]._id);
    expect(response.data.users.edges[9].node._id).toEqual(users[10]._id);
  });
  it("list first 10 before the last record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const users = (await UserModel.findAll({
      order: [["name", "ASC"]],
      limit: 10,
      offset: 0
    })) as User[];
    const afterCursor = string2Cursor(users[0].name, "user-name-");
    const beforeCursor = string2Cursor(users[9].name, "user-name-");
    const response = await client.users(afterCursor, 4, beforeCursor, 3);
    expect(response.errors).toBeUndefined();
    expect(response.data.users).not.toBeNull();
    expect(response.data.users.edges).toHaveLength(3);
    expect(response.data.users.edges[0].node._id).toEqual(users[2]._id);
    expect(response.data.users.edges[2].node._id).toEqual(users[4]._id);
  });
});
