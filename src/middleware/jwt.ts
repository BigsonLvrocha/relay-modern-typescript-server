import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { VerifiedRequest } from "../types/request";

export const verifyJwt = async (
  request: Request,
  response: Response,
  next: (request: Express.Request, response: Express.Response) => any
): Promise<any> => {
  let userId: string | undefined;
  const tokenHeader = request.get("x-access-token");
  if (tokenHeader) {
    const token = tokenHeader.substring(6);
    const { userId: userIdJwt } = jwt.verify(token, process.env
      .APP_SECRET as string) as any;
    userId = userIdJwt;
  }
  const newReq: VerifiedRequest = {
    userId,
    ...request
  };
  return next(newReq, response);
};
