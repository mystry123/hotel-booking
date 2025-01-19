export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: ['**/tests/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleFileExtensions: ['js'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],
    coverageDirectory: 'coverage'
}