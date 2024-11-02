/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	rootDir: './',
	roots: ['<rootDir>/src'],
	moduleDirectories: ['node_modules', '../node_modules'],
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
		'^.+.jsx?$': ['babel-jest', {}]
	},
	transformIgnorePatterns: ['node_modules/(?!(@noble)/)']
};
