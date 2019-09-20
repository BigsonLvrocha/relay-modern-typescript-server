import { mergeSchemas } from "../modules/mergeSchemas";
import * as path from "path";
import * as fs from "fs";

const pathToModules = path.join(__dirname, "..", "modules");
const file = mergeSchemas(pathToModules);
fs.writeFile(
  path.join(__dirname, "..", "..", "mainSchema.graphql"),
  file,
  err => console.log(err)
);
