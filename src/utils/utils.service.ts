import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';
import {
	ClientOptions,
	MicroserviceOptions,
	Transport,
} from '@nestjs/microservices';
import { rm } from 'node:fs/promises';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { env } from 'node:process';

type CrtFileCache = {
	[cert: string]: string;
};

let appTmpDir: string;
const crtFiles: CrtFileCache = {};

@Injectable()
export class UtilsService implements BeforeApplicationShutdown {
	async beforeApplicationShutdown() {
		if (!appTmpDir) return;
		await rm(appTmpDir, {
			recursive: true,
			force: true,
		});
	}

	getAppTmpDir(): string {
		if (appTmpDir) return appTmpDir;
		appTmpDir = mkdtempSync(join(tmpdir(), 'nothingwallet-'));
		return appTmpDir;
	}

	env(name: string, required = true) {
		const value = env[name];
		if (value || !required) return value;
		throw new TypeError(`please define ${name} environment variable`);
	}

	getDbConnectionUrl() {
		const user = encodeURIComponent(this.env('DB_USER')),
			pass = encodeURIComponent(this.env('DB_PASS')),
			host = this.env('DB_HOST'),
			port = this.env('DB_PORT'),
			name = encodeURIComponent(this.env('DB_NAME'));
		const connectionUrl = `postgresql://${user}:${pass}@${host}:${port}/${name}`;
		const sslCert = this.env('DB_SSL_CERT', false);
		if (!sslCert) return connectionUrl;
		const sslMode = this.env('DB_SSL_MODE', false) || 'verify-full';
		if (!(sslCert in crtFiles)) {
			const tmpDir = this.getAppTmpDir();
			const certName = randomBytes(16).toString('hex') + '.crt';
			const path = join(tmpDir, certName);
			writeFileSync(path, sslCert, 'utf8');
			crtFiles[sslCert] = path;
		}
		const crtPath = crtFiles[sslCert];
		return connectionUrl + `?sslmode=${sslMode}&sslrootcert=${crtPath}`;
	}

	getRmqClientOptions(queue: string): ClientOptions {
		const proto = this.env('AMQP_PROTO'),
			user = encodeURIComponent(this.env('AMQP_USER')),
			pass = encodeURIComponent(this.env('AMQP_PASS')),
			host = this.env('AMQP_HOST'),
			port = this.env('AMQP_PORT');
		return {
			transport: Transport.RMQ,
			options: {
				urls: [`${proto}://${user}:${pass}@${host}:${port}`],
				queue,
			},
		};
	}

	getRmqServerOptions(queue: string): MicroserviceOptions {
		const proto = this.env('AMQP_PROTO'),
			user = encodeURIComponent(this.env('AMQP_USER')),
			pass = encodeURIComponent(this.env('AMQP_PASS')),
			host = this.env('AMQP_HOST'),
			port = this.env('AMQP_PORT');
		return {
			transport: Transport.RMQ,
			options: {
				urls: [`${proto}://${user}:${pass}@${host}:${port}`],
				queue,
			},
		};
	}
}
