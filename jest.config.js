/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    coverageReporters: ["html", "text", "text-summary", "cobertura", "lcov"],
    testPathIgnorePatterns: ["/node_modules/", "/build/"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            statements: 70,
            branches: 70,
            functions: 70,
            lines: 70
        }
    }
};
