import { Body, Controller, Post } from '@nestjs/common';
import { QueryService } from 'src/services/query.service';
import { ResponseService } from 'src/services/response.service';
import { RequestQuery } from 'src/types/request';

@Controller('/query')
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async post(@Body() request: RequestQuery) {
    try {
      const result = await this.queryService.query(request.query);
      return this.responseService.success({
        payload: result,
        message: 'Все круто',
      });
    } catch (error) {
      return this.responseService.error({
        message: error,
      });
    }
  }
}
