import { Request } from "express";
import * as jwt from "jsonwebtoken";
import * as tp from "typed-promisify";

const verify = tp.promisify(jwt.verify);

export const verifyJwt = async (request: Request): Promise<string | null> => {
  const tokenHeader = request.get("x-access-token");
  if (!tokenHeader) {
    return null;
  }
  const token = tokenHeader.substring(6);
  return verify(token, process.env.APP_SECRET as string) as any;
};
