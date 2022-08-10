import { Name } from '@/helpers';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
	providers: [UtilsService],
	exports: [UtilsService],
})
@Name('UtilsModule')
export class UtilsModule {}
