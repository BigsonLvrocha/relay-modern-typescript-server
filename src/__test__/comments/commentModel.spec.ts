import { sequelize } from "../../services/sequelize";
import * as faker from "faker";
import { User } from "../../models/User.model";
import { ModelCtor } from "sequelize/types";
import { Post } from "../../models/Post.model";
import { Comment } from "../../models/Comment.model";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;
const CommentModel = sequelize.models.Comment as ModelCtor<Comment>;

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
    const comment = (await CommentModel.create({
      comment: faker.lorem.paragraph(),
      postId: post._id,
      authorId: user._id
    })) as Post;
    const post2 = (await PostModel.findByPk(post._id, {
      include: [Comment]
    })) as Post;
    expect(post2._id).toEqual(post2._id);
    expect(post2.comments).toHaveLength(1);
    expect(post2.comments[0]._id).toEqual(comment._id);
  });
});
