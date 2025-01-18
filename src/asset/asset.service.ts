import {BadRequestException, Injectable} from '@nestjs/common';
import {Asset} from '@prisma/client';
import {PaginationQueryDto, PaginatedResponseDto} from '../common/dtos/pagination.dto';
import {formatPaginatedResponse, calculateTakeAndSkip} from '../common/helper/paginate.helper';
import {PrismaService} from '../prisma/prisma.service';
import {GetAssetsInputDto} from './dtos/asset-input.dto';

@Injectable()
export class AssetService {
  constructor(private prismaService: PrismaService) {}

  private getSelectFields() {
    return {
      id: true,
      type: true,
      serial: true,
      description: true,
      status: true,
      location: {
        select: {
          id: true,
          name: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    };
  }

  private transformAssetConditions(query: GetAssetsInputDto) {
    const conditions = {
      AND: [],
    } as any;
    if (query?.locationId) {
      conditions.AND.push({locationId: +query.locationId});
    }
    if (query?.organizationId) {
      conditions.AND.push({organizationId: +query.organizationId});
    }
    if (query?.searchKeyword) {
      conditions.AND.push({
        OR: [
          {
            serial: {
              contains: query.searchKeyword,
              mode: 'insensitive',
            },
          },
          {
            description: {
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
  ): Promise<PaginatedResponseDto<Asset>> {
    const count = await this.prismaService.asset.count({
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

    const items = await this.prismaService.asset.findMany({
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

  async getAll(query: GetAssetsInputDto, pagination: PaginationQueryDto) {
    const {conditions, orderBy} = this.transformAssetConditions(query);
    return this.genericGetAll(conditions, pagination, orderBy);
  }
}
