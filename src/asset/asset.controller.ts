import {Controller, Get, HttpStatus, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AssetService} from './asset.service';
import {GetAssetsInputDto} from './dtos/asset-input.dto';
import {PaginationParamDecorator} from 'src/common/decorators/pagination.decorator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';

@ApiTags('Assets')
@Controller('assets')
export class AssetController {
  constructor(private service: AssetService) {}

  @Get()
  @ApiOperation({
    operationId: 'getAllAssets',
    description: 'Get all',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all',
  })
  async getAll(@Query() query: GetAssetsInputDto, @PaginationParamDecorator() pagination: PaginationQueryDto) {
    return this.service.getAll(query, pagination);
  }
}
