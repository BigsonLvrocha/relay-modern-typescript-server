import {
  Table,
  Model,
  BeforeCreate,
  Column,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import * as uuid from "uuid/v4";
import { User } from "./User.model";
import { Post } from "./Post.model";

@Table({
  tableName: "comments"
})
export class Comment extends Model<Comment> {
  @BeforeCreate({ name: "giveId" }) static async giveId(instance: Comment) {
    instance._id = uuid();
  }

  @Column({
    primaryKey: true
  })
  // tslint:disable-next-line: variable-name
  _id: string;

  @Column comment: string;
  @ForeignKey(() => User) @Column authorId: string;

  @ForeignKey(() => Post) @Column postId: string;

  @BelongsTo(() => Post) post: Post;
  @BelongsTo(() => User) author: User;
}
