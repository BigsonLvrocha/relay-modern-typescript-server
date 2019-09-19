import { generateNamespace } from "@gql2ts/from-schema";
import { genSchema } from "../modules";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const myNamespace = generateNamespace("GQL", genSchema(), {
  ignoreTypeNameDeclaration: true
});
fs.writeFile(
  path.join(__dirname, "..", "types", "schemaTypes.d.ts"),
  myNamespace,
  e => {
    console.log(e);
  }
);
