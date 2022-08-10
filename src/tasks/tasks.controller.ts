import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { TasksService } from './tasks.service';

const controller = 'tasks';

@Controller(controller)
export class TasksController {
	constructor(private readonly tasks: TasksService) {}

	@MessagePattern({ controller, method: 'subscribe' })
	subscribe({ name, scopes }): Observable<any> {
		return this.tasks.subscribe(name, scopes);
	}
}
