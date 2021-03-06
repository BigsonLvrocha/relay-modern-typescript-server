import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { sequelize } from "../../services/sequelize";
import { User } from "../../models/User.model";
import { ModelCtor } from "sequelize/types";
import { Post } from "../../models/Post.model";
import * as uuid from "uuid/v4";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;

describe("post query", () => {
  it("returns null on post not found", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.post(`post-${uuid()}`);
    expect(response.data.post).toBeNull();
  });
  it("returns post on query", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const title = faker.name.title();
    const description = faker.lorem.paragraph();
    const user = (await UserModel.create({
      email,
      name,
      password
    })) as User;
    const post = (await PostModel.create({
      title,
      description,
      authorId: user._id
    })) as Post;
    const response = await client.post(`post-${post._id}`);
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post._id).toEqual(post._id);
    expect(response.data.post.author._id).toEqual(user._id);
  });
});
