import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Name } from '@/helpers';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
})
@Name('AppModule')
export class AppModule {}
