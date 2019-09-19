import {
  Table,
  Column,
  Model,
  BeforeCreate,
  HasMany
} from "sequelize-typescript";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcryptjs";
import { Post } from "./Post.model";

@Table({
  tableName: "users",
  timestamps: false
})
export class User extends Model<User> {
  @BeforeCreate({ name: "giveId" }) static async giveId(instance: User) {
    instance._id = uuid();
    instance.password = await bcrypt.hash(instance.password, 10);
  }

  @Column name: string;
  @Column({
    primaryKey: true
  })
  // tslint:disable-next-line: variable-name
  _id: string;
  @Column email: string;
  @Column password: string;
  @Column active: boolean;

  @HasMany(() => Post, "authorId")
  posts: Post[];
}
