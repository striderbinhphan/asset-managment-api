import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE} from '../constants';
import {PaginatedResponseDto, PaginationQueryDto} from '../dtos/pagination.dto';

export interface IPaginateInput {
  items: any[];
  page: number;
  limit: number;
  count: number;
}

export function calculateTakeAndSkip(data: PaginationQueryDto): {
  take: number;
  skip: number;
} {
  const limit = data?.limit || DEFAULT_PAGINATION_LIMIT;
  const page = data?.page || DEFAULT_PAGINATION_PAGE;
  return {
    take: limit,
    skip: (page - 1) * limit,
  };
}

export function formatPaginatedResponse<T>({items, page, limit, count}: IPaginateInput): PaginatedResponseDto<T> {
  const pageCount = count ? Math.ceil(count / limit) : 1;
  return {
    items,
    page,
    limit,
    count,
    pageCount,
  };
}
