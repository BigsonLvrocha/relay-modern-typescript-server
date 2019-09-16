export const Cors = {
  credentials: true,
  origin:
    process.env.NODE_ENV !== "production"
      ? "*"
      : (process.env.FRONTEND_HOST as string)
};
