import { sequelize } from "../../services/sequelize";

export default async () => {
  const UserModel = sequelize.models.User;
  await UserModel.truncate();
};
