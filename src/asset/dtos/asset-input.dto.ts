import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNumber, IsNumberString, IsOptional, IsString} from 'class-validator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';

export class GetAssetsInputDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  locationId?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  organizationId?: number;

  @ApiPropertyOptional({
    example: 'any',
    required: false,
    description: 'search keyword',
  })
  @IsOptional()
  @IsString()
  public searchKeyword: string;
}
