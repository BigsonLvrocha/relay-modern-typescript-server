import { sequelize } from "../../services/sequelize";
import { ModelCtor } from "sequelize-typescript";
import { User } from "../../models/User.model";
import { Post } from "../../models/Post.model";
import { TestClient } from "../util/testClient";
import * as faker from "faker";
import { Comment } from "../../models/Comment.model";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;
const CommentModel = sequelize.models.Comment as ModelCtor<Comment>;

describe("generic node query", () => {
  it("resolves user type", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const user = (await UserModel.create({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password()
    })) as User;
    const id = `user-${user._id}`;
    const response = await client.node(
      id,
      `
      ... on User {
        name
        email
        _id
      }
    `
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.node).not.toBeNull();
    expect(response.data.node._id).toEqual(user._id);
    expect(response.data.node.name).toEqual(user.name);
    expect(response.data.node.email).toEqual(user.email);
  });
  it("resolves post type", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const user = (await UserModel.create({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password()
    })) as User;
    const post = (await PostModel.create({
      authorId: user._id,
      title: faker.name.title(),
      description: faker.lorem.paragraph()
    })) as Post;
    const id = `post-${post._id}`;
    const response = await client.node(
      id,
      `
      ... on Post {
        title
        description
        _id
      }
    `
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.node).not.toBeNull();
    expect(response.data.node._id).toEqual(post._id);
    expect(response.data.node.title).toEqual(post.title);
    expect(response.data.node.description).toEqual(post.description);
  });

  it("resolves comment type", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const user = (await UserModel.create({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password()
    })) as User;
    const post = (await PostModel.create({
      authorId: user._id,
      title: faker.name.title(),
      description: faker.lorem.paragraph()
    })) as Post;
    const comment = (await CommentModel.create({
      authorId: user._id,
      postId: post._id,
      comment: faker.lorem.paragraph()
    })) as Comment;
    const id = `comment-${comment._id}`;
    const response = await client.node(
      id,
      `
      ... on Comment {
        _id
        comment
      }
    `
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.node).not.toBeNull();
    expect(response.data.node._id).toEqual(comment._id);
    expect(response.data.node.comment).toEqual(comment.comment);
  });
});
