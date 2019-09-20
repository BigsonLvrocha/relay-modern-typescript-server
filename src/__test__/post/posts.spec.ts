import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { sequelize } from "../../services/sequelize";
import { User } from "../../models/User.model";
import { ModelCtor } from "sequelize/types";
import { Post } from "../../models/Post.model";
import { range } from "lodash";
import { post2Cursor } from "../../modules/post/types/typeMap";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;

describe("post query", () => {
  beforeAll(async () => {
    const usersRange = range(0, 20);
    const usersPromise = usersRange.map(
      () =>
        UserModel.create({
          email: faker.internet.email(),
          name: faker.internet.userName(),
          password: faker.internet.password()
        }) as Promise<User>
    );
    const users = await Promise.all(usersPromise);
    const promises = users.map(
      user =>
        PostModel.create({
          title: faker.name.title(),
          description: faker.lorem.paragraph(),
          authorId: user._id
        }) as Promise<Post>
    );
    await Promise.all(promises);
  });

  it("lists first 10 on default", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const posts = (await PostModel.findAll({
      limit: 10,
      order: [["createdAt", "DESC"], ["authorId", "ASC"]]
    })) as Post[];
    const response = await client.feed();
    expect(response.errors).toBeUndefined();
    expect(response.data.feed).not.toBeUndefined();
    expect(response.data.feed).not.toBeNull();
    expect(response.data.feed.edges).toHaveLength(10);
    expect(response.data.feed.edges[0].node._id).toEqual(posts[0]._id);
    expect(response.data.feed.edges[9].node._id).toEqual(posts[9]._id);
  });

  it("list first 5", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const posts = (await PostModel.findAll({
      limit: 5,
      order: [["createdAt", "DESC"], ["authorId", "ASC"]]
    })) as Post[];
    const response = await client.feed(undefined, 5);
    expect(response.errors).toBeUndefined();
    expect(response.data.feed).not.toBeNull();
    expect(response.data.feed.edges).toHaveLength(5);
    expect(response.data.feed.edges[0].node._id).toEqual(posts[0]._id);
    expect(response.data.feed.edges[4].node._id).toEqual(posts[4]._id);
  });

  it("list last 10", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const totalCount = await PostModel.count();
    const posts = (await PostModel.findAll({
      order: [["createdAt", "DESC"], ["authorId", "ASC"]],
      limit: 10,
      offset: totalCount - 10
    })) as Post[];
    const response = await client.feed(undefined, undefined, undefined, 10);
    expect(response.errors).toBeUndefined();
    expect(response.data.feed).not.toBeNull();
    expect(response.data.feed.edges).toHaveLength(10);
    expect(response.data.feed.edges[0].node._id).toEqual(posts[0]._id);
    expect(response.data.feed.edges[9].node._id).toEqual(posts[9]._id);
  });

  it("list first 10 after the second record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const posts = (await PostModel.findAll({
      order: [["createdAt", "DESC"], ["authorId", "ASC"]],
      limit: 13,
      offset: 0
    })) as Post[];
    const afterCursor = post2Cursor(posts[1]);
    const response = await client.feed(afterCursor);
    expect(response.errors).toBeUndefined();
    expect(response.data.feed).not.toBeNull();
    expect(response.data.feed.edges).toHaveLength(10);
    expect(response.data.feed.edges[0].node._id).toEqual(posts[2]._id);
    expect(response.data.feed.edges[9].node._id).toEqual(posts[11]._id);
  });

  it("list first 10 before the last record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const totalCount = await PostModel.count();
    const posts = (await PostModel.findAll({
      order: [["createdAt", "DESC"], ["authorId", "ASC"]],
      limit: 12,
      offset: totalCount - 12
    })) as Post[];
    const beforeCursor = post2Cursor(posts[11]);
    const response = await client.feed(undefined, undefined, beforeCursor, 10);
    expect(response.data.feed).not.toBeNull();
    expect(response.data.feed.edges).toHaveLength(10);
    expect(response.data.feed.edges[0].node._id).toEqual(posts[1]._id);
    expect(response.data.feed.edges[9].node._id).toEqual(posts[10]._id);
  });

  it("gives precedence to first argument", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const posts = (await PostModel.findAll({
      order: [["createdAt", "DESC"], ["authorId", "ASC"]],
      limit: 10,
      offset: 0
    })) as Post[];
    const afterCursor = post2Cursor(posts[0]);
    const beforeCursor = post2Cursor(posts[9]);
    const response = await client.feed(afterCursor, 4, beforeCursor, 3);
    expect(response.data.feed).not.toBeNull();
    expect(response.data.feed.edges).toHaveLength(3);
    expect(response.data.feed.edges[0].node._id).toEqual(posts[2]._id);
    expect(response.data.feed.edges[2].node._id).toEqual(posts[4]._id);
  });
});
