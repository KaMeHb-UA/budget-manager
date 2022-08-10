import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Name } from '@/helpers';
import { TasksModule } from '@/tasks';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TasksModule,
	],
})
@Name('AppModule')
export class AppModule {}
