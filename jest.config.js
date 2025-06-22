module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|js)", "<rootDir>/src/**/?(*.)(test|spec).(ts|js)"],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/setup.ts",
    "<rootDir>/src/__tests__/jest-globals.d.ts",
    "<rootDir>/src/__tests__/mocks/",
  ],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/__tests__/**/*", "!src/index.ts"],
  testTimeout: 10000,
  clearMocks: true,
  verbose: true,
}
