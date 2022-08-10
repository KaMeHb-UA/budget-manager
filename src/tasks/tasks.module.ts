import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Name } from '@/helpers';

@Module({
	providers: [TasksService],
	exports: [TasksService],
	controllers: [TasksController],
})
@Name('TasksModule')
export class TasksModule {}
