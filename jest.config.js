module.exports = {
  globalSetup: "./src/__test__/setup/setup.ts",
  setupFilesAfterEnv: ["./src/__test__/setup/setupJest.js"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(\\.|/)(test|spec)\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
