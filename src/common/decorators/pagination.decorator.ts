import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_LIMIT} from '../constants';
import {PaginationQueryDto} from '../dtos/pagination.dto';

export const PaginationParamDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationQueryDto => {
    const req = ctx.switchToHttp().getRequest();
    const page = req.query.page && Number(req.query.page) > 0 ? Number(req.query.page) : DEFAULT_PAGINATION_PAGE;
    const limit = req.query.limit && Number(req.query.limit) > 0 ? Number(req.query.limit) : DEFAULT_PAGINATION_LIMIT;
    const sort = req.query.sort ? req.query.sort : '';
    return {
      page,
      limit,
      sort,
    };
  },
);
