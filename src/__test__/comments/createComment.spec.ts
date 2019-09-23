import * as faker from "faker";
import { TestClient } from "../util/testClient";

describe("Post model plugin", () => {
  it("creates post for user", async () => {
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
    const {
      data: {
        UserCreatePost: { post }
      }
    } = await client.UserCreatePost(title, description, token);
    const response = await client.createComment(
      faker.lorem.paragraph(),
      token,
      post.id
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.CreateComment.comment).not.toBeUndefined();
    expect(response.data.CreateComment.comment).not.toBeNull();
    expect(response.data.CreateComment.error).not.toBeDefined();
    expect(response.data.CreateComment.comment.author._id).toEqual(
      response.data.CreateComment.comment.post.author._id
    );
  });
});
