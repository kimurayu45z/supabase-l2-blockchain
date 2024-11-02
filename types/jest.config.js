/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	rootDir: './src',
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}]
	}
};
