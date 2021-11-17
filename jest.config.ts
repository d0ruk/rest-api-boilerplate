import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: true,
  verbose: true,
  errorOnDeprecated: true,
  silent: true,
  coverageDirectory: "<rootDir>/coverage/",
  coverageReporters: ["lcov", "text-summary"],
  moduleDirectories: ["node_modules", "src"],
  extensionsToTreatAsEsm: [".ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};

export default config;
