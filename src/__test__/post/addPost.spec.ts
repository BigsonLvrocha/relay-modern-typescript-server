import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { sequelize } from "../../services/sequelize";
import { ModelCtor } from "sequelize/types";
import { Post } from "../../models/Post.model";

const PostModel = sequelize.models.Post as ModelCtor<Post>;

describe("add post mutation", () => {
  it("inserts post on database", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const title = faker.name.title();
    const description = faker.lorem.paragraph();
    const {
      data: {
        UserRegisterWithEmail: { token }
      }
    } = await client.register(email, password, name);
    const response = await client.UserCreatePost(title, description, token);
    expect(response.errors).toBeUndefined();
    expect(response.data.UserCreatePost).not.toBeNull();
    expect(response.data.UserCreatePost.post).not.toBeNull();
    const post = (await PostModel.findByPk(
      response.data.UserCreatePost.post._id
    )) as Post;
    expect(post._id).toEqual(response.data.UserCreatePost.post._id);
    expect(post.authorId).toEqual(response.data.UserCreatePost.post.author._id);
  });
});
