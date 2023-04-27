import { Module } from '@nestjs/common';
import { ResponseService } from 'src/services/response.service';

import { QueryController } from 'src/controllers/query.controller';
import { QueryService } from 'src/services/query.service';

@Module({
  controllers: [QueryController],
  providers: [QueryService, ResponseService],
  exports: [QueryService],
})
export class QueryModule {}
