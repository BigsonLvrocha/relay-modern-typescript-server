export const base64 = (str: string): string =>
  Buffer.from(str, "ascii").toString("base64");
export const unbase64 = (b64: string): string =>
  Buffer.from(b64, "base64").toString("ascii");

export const string2Cursor = (name: string, prefix: string) =>
  prefix + base64(name);

export const cursor2String = (cursor: string, prefix: string) =>
  unbase64(cursor.substring(prefix.length));
