module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current'
				},
				modules: 'commonjs'
			}
		]
	],
	include: ['./src/**/*', '../node_modules/@noble/**']
};
