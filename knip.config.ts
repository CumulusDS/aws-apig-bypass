import type { KnipConfig } from "knip";

const jsExtensionsGlob = "js,cjs,mjs,jsx";
const tsExtensionsGlob = "ts,cts,mts,tsx";
const extensionsGlob = `${jsExtensionsGlob},${tsExtensionsGlob}`;

/**
 * Jest configuration
 */
const jest: KnipConfig = {
  jest: {
    config: ["jest.config.{js,ts,mjs,cjs,json}", "jest-dynamodb-config.js", "package.json"],
    entry: [
      "**/?(*.)+(spec|test).[jt]s?(x)",
      "**/*.{bench,spec,spec-d,test,test-d}.?(c|m)[jt]s?(x)",
      "**/{bench,spec,spec-d,test,test-d}/**.[jt]s?(x)",
      "**/{__mocks__,__tests__}/**/*.[jt]s?(x)",
    ],
  },
};

/**
 * Serverless configuration - not auto-detected by knip as we use OSLS
 */
const serverless: KnipConfig = {
  "serverless-framework": {
    config: ["serverless.{js,cjs,mjs,ts,cts,mts,yml,yaml}"],
  },
};

/**
 * TypeScript configuration - includes extended set of tsconfig files
 */
const typescript: KnipConfig = {
  typescript: {
    config: ["tsconfig.json", "tsconfig.esm.json"],
  },
};

/**
 * Vitest configuration - future proofing
 */
const vitest: KnipConfig = {
  vitest: {
    config: ["vitest.config.{js,mjs,ts,cjs,mts,cts}", "vitest.{workspace,projects}.{js,mjs,ts,cjs,mts,cts,json}"],
    entry: [
      "**/?(*.)+(spec|test).[jt]s?(x)",
      "**/*.{bench,spec,spec-d,test,test-d}.?(c|m)[jt]s?(x)",
      "**/{bench,spec,spec-d,test,test-d}/**.[jt]s?(x)",
      "**/{__mocks__,__tests__}/**/*.[jt]s?(x)",
    ],
  },
};

const config = async (): Promise<KnipConfig> => {
  return {
    project: [`src/**/*.{${extensionsGlob}}`, `test/**/*.{${extensionsGlob}}`],
    rules: {
      duplicates: "error",
      files: "warn",
    },
    ignoreBinaries: [
      // "getconf", // macOS binary
      "rev", // macOS binary
      // "make", // gnu/macOS binary
      // "sysctl", // macOS binary
    ],
    ignoreDependencies: [
      // "@cumulusds/aws-cloudformation-wait-ready", // used in CI
      // "@testmo/testmo-cli", // used in CI
      // "git-list-updated", // used in CI
      // "swagger-ui-dist", // used in src/handlers/swagger.ts
      // "@cumulusds/graphql-schemas", // referenced in "codegen.yml"
    ],
    ...jest,
    ...serverless,
    ...typescript,
    ...vitest,
  };
};

export default config;
