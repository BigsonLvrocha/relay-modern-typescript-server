import { Request } from "express";
import * as jwt from "jsonwebtoken";
import * as tp from "typed-promisify";

const verify = tp.promisify(jwt.verify);

export const verifyJwt = async (request: Request): Promise<any> => {
  const tokenHeader = request.get("Authorization");
  if (!tokenHeader) {
    return null;
  }
  const token = tokenHeader.substring(7);
  return verify(token, process.env.APP_SECRET as string) as any;
};
