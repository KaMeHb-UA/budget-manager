//@ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path');
const { readFile } = require('node:fs/promises');
const { existsSync } = require('node:fs');

/** @type {import('esbuild').Plugin} */
const nativePlugin = {
	name: 'native',
	setup(build) {
		build.onResolve({ filter: /\.node$/ }, (args) => {
			if (args.namespace === 'native-stub') {
				return {
					path: args.path,
					namespace: 'native-binary',
				};
			}
			if (args.resolveDir === '') return; // Ignore unresolvable paths
			return {
				path: path.relative(
					path.resolve(__dirname, '..'),
					path.isAbsolute(args.path)
						? args.path
						: path.join(args.resolveDir, args.path),
				),
				namespace: 'native-stub',
			};
		});
		build.onLoad(
			{ filter: /.*/, namespace: 'native-stub' },
			async (args) => ({
				contents: existsSync(args.path)
					? `module.exports = require(require(${JSON.stringify(
							args.path,
					  )}));`
					: `throw new Error("Cannot require ${args.path}: file not found")`,
			}),
		);
		build.onLoad(
			{ filter: /.*/, namespace: 'native-binary' },
			async (args) => ({
				contents: await readFile(args.path),
				loader: 'file',
			}),
		);
	},
};

module.exports = nativePlugin;
