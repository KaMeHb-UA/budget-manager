import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import '@/decorate-basic-classes';
import { env } from 'node:process';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.TCP,
			options: {
				host: '0.0.0.0',
				port: Number(env.PORT || 3000),
			},
		},
	);
	await app.listen();
}

bootstrap();
