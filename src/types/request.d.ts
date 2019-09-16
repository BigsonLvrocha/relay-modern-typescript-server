export interface VerifiedRequest extends Express.Request {
  userId: string | undefined;
}
