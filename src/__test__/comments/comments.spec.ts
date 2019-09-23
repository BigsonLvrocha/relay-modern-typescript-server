import { sequelize } from "../../services/sequelize";
import * as faker from "faker";
import { User } from "../../models/User.model";
import { ModelCtor } from "sequelize/types";
import { Post } from "../../models/Post.model";
import { Comment } from "../../models/Comment.model";
import { range } from "lodash";
import { TestClient } from "../util/testClient";
import { comment2Cursor } from "../../modules/comment/types/typeMap";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;
const CommentModel = sequelize.models.Comment as ModelCtor<Comment>;
let postId: string;

describe("Post model plugin", () => {
  beforeAll(async () => {
    const usersRange = range(0, 20);
    const usersPromise = usersRange.map(() =>
      UserModel.create({
        email: faker.internet.email(),
        name: faker.internet.userName(),
        password: faker.internet.password()
      })
    ) as Array<Promise<User>>;
    const users = await Promise.all(usersPromise);
    const post = (await PostModel.create({
      title: faker.name.title(),
      description: faker.lorem.paragraph(),
      authorId: users[0]._id
    })) as Post;
    postId = post._id;
    const promises = users.map(user =>
      CommentModel.create({
        authorId: user._id,
        postId,
        comment: faker.lorem.paragraph()
      })
    );
    await Promise.all(promises);
  });

  it("lists first 10 on default", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const comments = (await CommentModel.findAll({
      limit: 10,
      order: [["createdAt", "ASC"], ["authorId", "ASC"]],
      where: { postId }
    })) as Comment[];
    const response = await client.postWithComments(`post-${postId}`);
    expect(response.errors).toBeUndefined();
    expect(response.data.post).not.toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post.comments.edges).toHaveLength(10);
    expect(response.data.post.comments.edges[0].node._id).toEqual(
      comments[0]._id
    );
    expect(response.data.post.comments.edges[9].node._id).toEqual(
      comments[9]._id
    );
  });

  it("list first 5", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const comments = (await CommentModel.findAll({
      limit: 5,
      order: [["createdAt", "ASC"], ["authorId", "ASC"]],
      where: { postId }
    })) as Comment[];
    const response = await client.postWithComments(
      `post-${postId}`,
      undefined,
      5
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post.comments.edges).toHaveLength(5);
    expect(response.data.post.comments.edges[0].node._id).toEqual(
      comments[0]._id
    );
    expect(response.data.post.comments.edges[4].node._id).toEqual(
      comments[4]._id
    );
  });

  it("list last 10", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const totalCount = await CommentModel.count({ where: { postId } });
    const comments = (await CommentModel.findAll({
      order: [["createdAt", "ASC"], ["authorId", "ASC"]],
      where: { postId },
      limit: 10,
      offset: totalCount - 10
    })) as Comment[];
    const response = await client.postWithComments(
      `post-${postId}`,
      undefined,
      undefined,
      undefined,
      10
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post.comments.edges).toHaveLength(10);
    expect(response.data.post.comments.edges[0].node._id).toEqual(
      comments[0]._id
    );
    expect(response.data.post.comments.edges[9].node._id).toEqual(
      comments[9]._id
    );
  });

  it("list first 10 after the second record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const comments = (await CommentModel.findAll({
      order: [["createdAt", "ASC"], ["authorId", "ASC"]],
      where: { postId },
      limit: 13,
      offset: 0
    })) as Comment[];
    const afterCursor = comment2Cursor(comments[1]);
    const response = await client.postWithComments(
      `post-${postId}`,
      afterCursor
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post.comments.edges).toHaveLength(10);
    expect(response.data.post.comments.edges[0].node._id).toEqual(
      comments[2]._id
    );
    expect(response.data.post.comments.edges[9].node._id).toEqual(
      comments[11]._id
    );
  });

  it("list first 10 before the last record", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const totalCount = await CommentModel.count({ where: { postId } });
    const comments = (await CommentModel.findAll({
      order: [["createdAt", "ASC"], ["authorId", "ASC"]],
      where: { postId },
      limit: 12,
      offset: totalCount - 12
    })) as Comment[];
    const beforeCursor = comment2Cursor(comments[11]);
    const response = await client.postWithComments(
      `post-${postId}`,
      undefined,
      undefined,
      beforeCursor,
      10
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post.comments.edges).toHaveLength(10);
    expect(response.data.post.comments.edges[0].node._id).toEqual(
      comments[1]._id
    );
    expect(response.data.post.comments.edges[9].node._id).toEqual(
      comments[10]._id
    );
  });

  it("gives precedence to first argument", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const comments = (await CommentModel.findAll({
      order: [["createdAt", "ASC"], ["authorId", "ASC"]],
      where: { postId },
      limit: 10,
      offset: 0
    })) as Comment[];
    const afterCursor = comment2Cursor(comments[0]);
    const beforeCursor = comment2Cursor(comments[9]);
    const response = await client.postWithComments(
      `post-${postId}`,
      afterCursor,
      4,
      beforeCursor,
      3
    );
    expect(response.errors).toBeUndefined();
    expect(response.data.post).not.toBeNull();
    expect(response.data.post.comments.edges).toHaveLength(3);
    expect(response.data.post.comments.edges[0].node._id).toEqual(
      comments[2]._id
    );
    expect(response.data.post.comments.edges[2].node._id).toEqual(
      comments[4]._id
    );
  });
});
