import {Injectable} from '@nestjs/common';
import {Organization} from '@prisma/client';
import {PaginationQueryDto, PaginatedResponseDto} from '../common/dtos/pagination.dto';
import {formatPaginatedResponse, calculateTakeAndSkip} from '../common/helper/paginate.helper';
import {PrismaService} from '../prisma/prisma.service';
import {CreateOrganizationInputDto, GetOrganizationsInputDto} from './dtos/organization-input.dto';

@Injectable()
export class OrganizationService {
  constructor(private prismaService: PrismaService) {}

  private getSelectFields() {
    return {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private transformOrganizationConditions(query: GetOrganizationsInputDto) {
    const conditions = {
      AND: [],
    } as any;
    if (query?.searchKeyword) {
      conditions.AND.push({
        OR: [
          {
            name: {
              contains: query.searchKeyword,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const orderBy = {} as any;
    if (query?.sort) {
      const sorts = query.sort.split(',');
      for (const sort of sorts) {
        const sortDirection = sort.startsWith('-') ? 'desc' : 'asc';
        orderBy[sort.replace('-', '')] = sortDirection;
      }
    }

    return {conditions, orderBy};
  }
  private async genericGetAll(
    conditions: any,
    pagination: PaginationQueryDto,
    orderBy: any,
  ): Promise<PaginatedResponseDto<Organization>> {
    const count = await this.prismaService.organization.count({
      where: conditions,
    });

    if (!count) {
      return formatPaginatedResponse({
        items: [],
        page: pagination.page,
        limit: pagination.limit,
        count,
      });
    }

    const items = await this.prismaService.organization.findMany({
      select: this.getSelectFields(),
      where: conditions,
      orderBy,
      ...calculateTakeAndSkip(pagination),
    });
    return formatPaginatedResponse({
      items,
      page: pagination.page,
      limit: pagination.limit,
      count,
    });
  }

  async getAll(query: GetOrganizationsInputDto, pagination: PaginationQueryDto) {
    const {conditions, orderBy} = this.transformOrganizationConditions(query);
    return this.genericGetAll(conditions, pagination, orderBy);
  }

  async create(data: CreateOrganizationInputDto) {
    return this.prismaService.organization.create({
      data,
    });
  }

  async update(organizationId: number, data: any) {
    return this.prismaService.organization.update({
      where: {
        id: organizationId,
      },
      data,
    });
  }

  async getById(organizationId: number) {
    return this.prismaService.organization.findUnique({
      include: {
        organizationLocations: {
          include: {location: true},
        },
      },
      where: {
        id: organizationId,
      },
    });
  }
  
  async delete(organizationId: number) {
    return this.prismaService.organization.delete({
      where: {
        id: organizationId,
      },
    });
  }
}
