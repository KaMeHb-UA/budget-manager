import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export async function callRemoteMethod<D = any, R = any>(
	client: ClientProxy,
	controller: string,
	method: string,
	data: D,
): Promise<R> {
	const { result, error } = await firstValueFrom(
		client.send({ controller, method }, data),
	);
	if (error) {
		throw new Error(error.message);
	}
	return result;
}

export type RPCResult<T> = Promise<
	{ result: T } | { error: Error | { message: string } }
>;

export async function toRPC<T>(promise: Promise<T>): RPCResult<T> {
	try {
		const result = await promise;
		return { result };
	} catch (e) {
		return e instanceof Error
			? { error: Object.assign({}, e, { message: e.message }) }
			: { error: { message: '' + e } };
	}
}
