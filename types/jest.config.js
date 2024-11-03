/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	rootDir: './',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}]
	}
};
