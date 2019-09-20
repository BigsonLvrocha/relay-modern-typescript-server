import { sequelize } from "../services/sequelize";
import * as faker from "faker";
import { range } from "lodash";
import { ModelCtor } from "sequelize/types";
import { User } from "../models/User.model";
import { Post } from "../models/Post.model";

const UserModel = sequelize.models.User as ModelCtor<User>;
const PostModel = sequelize.models.Post as ModelCtor<Post>;

const populateDB = async () => {
  const userRange = range(0, 20);
  const createPromises = userRange.map(() =>
    UserModel.create({
      name: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    })
  );
  const users = (await Promise.all(createPromises)) as User[];
  const postPromises = users.map(user =>
    PostModel.create({
      description: faker.lorem.paragraph(),
      title: faker.name.title(),
      authorId: user._id
    })
  );
  return Promise.all(postPromises);
};

populateDB()
  .then(() => console.log("database populated"))
  .catch(err => console.log(err));
