import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString} from 'class-validator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';

export class GetOrganizationsInputDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'any',
    required: false,
    description: 'search keyword',
  })
  @IsOptional()
  @IsString()
  public searchKeyword: string;
}
