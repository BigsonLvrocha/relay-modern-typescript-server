import * as faker from "faker";
import { TestClient } from "../util/testClient";

describe("post edit resolver", () => {
  it("lets user edit own post", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const email = faker.internet.email();
    const name = faker.internet.userName();
    const password = faker.internet.password();
    const {
      data: {
        UserRegisterWithEmail: { token }
      }
    } = await client.register(email, password, name);
    const title1 = faker.name.title();
    const title2 = faker.name.title();
    const {
      data: {
        UserCreatePost: {
          post: { id, _id }
        }
      }
    } = await client.UserCreatePost(title1, faker.lorem.paragraph(), token);
    const response = await client.editPost(id, title2, token);
    expect(response.errors).toBeUndefined();
    expect(response.data.EditPost.post.title).toEqual(title2);
    expect(response.data.EditPost.post._id).toEqual(_id);
  });
});
