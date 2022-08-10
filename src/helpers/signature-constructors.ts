import { ModuleMetadata } from '@nestjs/common';

type AsyncModuleBasic = Pick<ModuleMetadata, 'imports'> & {
	inject?: any[];
};

type Reenumerate<O> = { [x in keyof O]: O[x] };

export type AsyncModuleSignature<
	Options,
	SyncOptions extends keyof Options,
> = Reenumerate<
	AsyncModuleBasic & {
		[x in SyncOptions]: Options[x];
	} & {
		useFactory: (
			...args: any[]
		) => Promise<Omit<Options, SyncOptions>> | Omit<Options, SyncOptions>;
	}
>;
