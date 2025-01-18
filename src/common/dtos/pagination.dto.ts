import {IsNumberString, IsOptional, IsString} from 'class-validator';

export abstract class PaginationQueryDto {
  @IsNumberString()
  @IsOptional()
  page?: number;

  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  sort: string;
}

export class PaginatedResponseDto<T> {
  items: T[];

  page: number;

  limit: number;

  count: number;

  pageCount: number;
}
