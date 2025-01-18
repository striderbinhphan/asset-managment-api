import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';
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

export class CreateOrganizationInputDto {
  @ApiPropertyOptional({
    example: 'AALK',
    required: false,
    description: 'the name of the organization',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateOrganizationInputDto {
  @ApiPropertyOptional({
    example: 'AALK',
    required: false,
    description: 'the name of the organization',
  })
  @IsOptional()
  @IsString()
  name: string;
}
