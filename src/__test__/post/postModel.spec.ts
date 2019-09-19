import { sequelize } from "../../services/sequelize";
import * as faker from "faker";
import { User } from "../../models/User.model";
import { ModelCtor } from "sequelize/types";
import { Post } from "../../models/Post.model";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;

describe("Post model plugin", () => {
  it("creates post for user", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.internet.userName();
    const title = faker.name.title();
    const description = faker.lorem.paragraph();
    const user = (await UserModel.create({
      email,
      password,
      name,
      active: true
    })) as User;
    const post = (await PostModel.create({
      title,
      description,
      authorId: user._id
    })) as Post;
    const user2 = (await UserModel.findByPk(user._id, {
      include: [Post]
    })) as User;
    expect(user._id).toEqual(user2._id);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    expect(user2.posts).toHaveLength(1);
    expect(user2.posts[0]._id).toEqual(post._id);
  });
});
