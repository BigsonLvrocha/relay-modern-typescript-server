import { mergeTypes } from "merge-graphql-schemas";
import * as glob from "glob";
import * as fs from "fs";

export const mergeSchemas = (pathToModules: string) =>
  mergeTypes(
    glob
      .sync(`${pathToModules}/**/*.graphql`)
      .map(x => fs.readFileSync(x, { encoding: "utf8" }))
  );
