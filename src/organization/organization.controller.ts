import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {OrganizationService} from './organization.service';
import {PaginationParamDecorator} from 'src/common/decorators/pagination.decorator';
import {PaginationQueryDto} from 'src/common/dtos/pagination.dto';
import {
  CreateOrganizationInputDto,
  GetOrganizationsInputDto,
  UpdateOrganizationInputDto,
} from './dtos/organization-input.dto';

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

  @Post()
  @ApiOperation({
    operationId: 'createOrganization',
    description: 'Create',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create',
  })
  async create(@Body() data: CreateOrganizationInputDto) {
    return this.service.create(data);
  }

  @Put(':organizationId')
  @ApiOperation({
    operationId: 'updateOrganization',
    description: 'Update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update',
  })
  async update(@Param('organizationId') organizationId: number, @Body() data: UpdateOrganizationInputDto) {
    return this.service.update(organizationId, data);
  }

  @Get(':organizationId')
  @ApiOperation({
    operationId: 'getOrganizationById',
    description: 'Get by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get by id',
  })
  async getById(@Param('organizationId') organizationId: number) {
    return this.service.getById(organizationId);
  }

  @Delete(':organizationId')
  @ApiOperation({
    operationId: 'deleteOrganization',
    description: 'Delete',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete',
  })
  async delete(@Param('organizationId') organizationId: number) {
    return this.service.delete(organizationId);
  }
}
