import {
  Table,
  Column,
  Model,
  BeforeCreate,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import * as uuid from "uuid/v4";
import { User } from "./User.model";

@Table({
  tableName: "posts"
})
export class Post extends Model<Post> {
  @BeforeCreate({ name: "giveId" }) static async giveId(instance: Post) {
    instance._id = uuid();
  }

  @Column({
    primaryKey: true
  })
  // tslint:disable-next-line: variable-name
  _id: string;
  @Column title: string;
  @Column description: string;

  @ForeignKey(() => User)
  @Column
  authorId: string;

  @BelongsTo(() => User)
  author: User;
}
