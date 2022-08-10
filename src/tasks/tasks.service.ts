import { Name } from '@/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, Subject, merge } from 'rxjs';

enum Events {
	sendNotify = 'send_notify',
}

@Injectable()
@Name('TasksService')
export class TasksService {
	private readonly logger = new Logger(TasksService.name);

	private readonly subscribeMap: { [event in Events]?: Subject<any>[] } = {};

	private checkScope(scope: string): scope is Events {
		return (Object.values(Events) as string[]).includes(scope);
	}

	subscribe(name: string, scopes: string[]): Observable<any> {
		const subjects: Subject<any>[] = [];
		const { subscribeMap } = this;
		const known: string[] = [],
			unknown: string[] = [];
		for (const scope of scopes) {
			if (this.checkScope(scope)) {
				const subject = new Subject<any>();
				if (!subscribeMap[scope]) subscribeMap[scope] = [subject];
				else subscribeMap[scope].push(subject);
				subjects.push(subject);
				known.push(scope);
			} else {
				unknown.push(scope);
			}
		}
		if (known.length)
			this.logger.log(
				`${name} subscribed with next scopes: ${known.join(', ')}`,
			);
		if (unknown.length)
			this.logger.warn(
				`${name} cannot subscribe to next unknown scopes: ${unknown.join(
					', ',
				)}. Skipping this scopes`,
			);
		return merge(...subjects);
	}

	sendNotify(text: string) {
		if (!(Events.sendNotify in this.subscribeMap)) return;
		for (const subject of this.subscribeMap[Events.sendNotify]) {
			subject.next(text);
		}
	}
}
