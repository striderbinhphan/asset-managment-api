import {Controller, Get, HttpStatus, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {OrganizationService} from './organization.service';
import {PaginationParamDecorator} from 'src/common/decorators/pagination.decorator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';
import {GetOrganizationsInputDto} from './dtos/organization-input.dto';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private service: OrganizationService) {}

  @Get()
  @ApiOperation({
    operationId: 'getAllOrganizations',
    description: 'Get all',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all',
  })
  async getAll(@Query() query: GetOrganizationsInputDto, @PaginationParamDecorator() pagination: PaginationQueryDto) {
    return this.service.getAll(query, pagination);
  }
}
