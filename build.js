// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { build: esbuild } = require('esbuild');
const { exit, argv } = require('node:process');
const { resolve } = require('node:path');
const { writeFile, copyFile, mkdir } = require('node:fs/promises');
const { readFileSync } = require('node:fs');
const nativePlugin = require('./esbuild/native');
const { parse: parseLockfile } = require('@yarnpkg/lockfile');

const { object: lockfile } = parseLockfile(
	readFileSync(resolve(__dirname, 'yarn.lock'), 'utf8'),
);

const nestOptionalModules = [
	// remove from this list to bundle it too
	'@nestjs/websockets/socket-module',
	// express isn't used in microservice
	'@nestjs/platform-express',
	'cache-manager',
	'fastify-static',
	'fastify-swagger',
	// microservices communication modules that is not used
	'kafkajs',
	'@grpc/grpc-js',
	'@grpc/proto-loader',
	'ioredis',
	'nats',
	'mqtt',
];

const distPackageJson = {
	private: true,
	type: 'commonjs',
	dependencies: {
		'swagger-ui-dist': versionFromLockfile('swagger-ui-dist'),
	},
};

/** @type {import('esbuild').BuildOptions & { outfile: string }} */
const buildConfig = {
	entryPoints: [resolve(__dirname, 'dist', 'src', 'main.js')],
	bundle: true,
	outfile: resolve(__dirname, 'dist', 'main.js'),
	allowOverwrite: true,
	minify: true,
	minifyIdentifiers: true,
	minifySyntax: true,
	minifyWhitespace: true,
	platform: 'node',
	target: 'node18',
	format: 'cjs',
	metafile: false,
	legalComments: 'none',
	sourcemap: false,
	plugins: [nativePlugin],
	external: nestOptionalModules.concat(
		[
			// will never be required due to existence of class-transformer/cjs/storage
			'class-transformer/storage',
			// will NOT be loaded at all due to existence of built-in "events" module
			'emitter',
			// will be loaded ONLY if env variable NODE_PG_FORCE_NATIVE is set
			'pg-native',
		],
		Object.keys(distPackageJson.dependencies || {}),
	),
	watch: argv.includes('--watch'),
};

function distFile(name) {
	return resolve(buildConfig.outfile, '..', name);
}

function versionFromLockfile(depname) {
	for (const i in lockfile) {
		if (i.startsWith(depname + '@')) {
			return i.slice(depname.length + 1);
		}
	}
}

async function build() {
	try {
		const start = Date.now();
		await mkdir(resolve(buildConfig.outfile, '..'), { recursive: true });
		await Promise.all([
			esbuild(buildConfig),
			writeFile(
				distFile('package.json'),
				JSON.stringify(distPackageJson),
			),
			copyFile(distFile('../yarn.lock'), distFile('yarn.lock')),
		]);
		console.log(
			`Built for production with esbuild in ${Date.now() - start} ms`,
		);
	} catch (e) {
		exit(1);
	}
}

build();
