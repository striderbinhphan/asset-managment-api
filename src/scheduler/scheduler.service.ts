import {AssetStatus, OrganizationLocationStatus, Prisma} from '@prisma/client';
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {BRProviderService} from 'src/external/br-provider/br-provider.service';
import {Cron, CronExpression} from '@nestjs/schedule';
import {GetAssetResponse} from 'src/external/br-provider/br-provider.interface';
import {chunk} from 'lodash';
@Injectable()
export class SchedulerService {
  constructor(
    private prismaService: PrismaService,
    private brProviderService: BRProviderService,
  ) {}
  private convertAssetStatus(status: string) {
    return status === 'actived' ? AssetStatus.activated : AssetStatus.unactive;
  }

  private getValidAssetsForSync(locationId: number, assets: GetAssetResponse[]) {
    return assets.filter((asset) => asset.location_id === locationId && new Date(asset.created_at) < new Date());
  }

  async getValidOrganizationLocations() {
    return this.prismaService.organizationLocation.findMany({
      where: {
        status: OrganizationLocationStatus.activated,
      },
    });
  }
  async insertAssets(organizationId: number, asserts: GetAssetResponse[]) {
    return this.prismaService.$transaction(async (trx) => {
      const chunks = chunk(asserts, 100);
      for (const chunk of chunks) {
        const insertedAssets = await trx.asset.findMany({where: {id: {in: chunk.map((a) => +a.id)}}});
        const newAssets = [];
        // insert asset by chunk
        for (const asset of chunk) {
          const insertedAsset = insertedAssets.find((insertedAsset) => insertedAsset.id === asset.id);
          const baseAssetInfo = {
            type: asset.type,
            serial: asset.serial,
            description: asset.description,
            status: this.convertAssetStatus(asset.status),
          };
          // if asset exist then update, else insert
          if (insertedAsset) {
            await trx.asset.update({
              where: {id: insertedAsset.id},
              data: {
                ...baseAssetInfo,
                id: +asset.id,
                createdAt: new Date(asset.created_at),
                updatedAt: new Date(asset.updated_at),
              },
            });
          } else {
            newAssets.push({
              ...baseAssetInfo,
              organizationId,
              locationId: asset.location_id,
              updatedAt: new Date(asset.updated_at),
            });
          }

          // insert new assets by batch to optimize query
          if (newAssets.length) {
            await trx.asset.createMany({data: newAssets});
          }
        }
      }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncAssets() {
    console.log('Syncing assets');
    const organizationLocations = await this.getValidOrganizationLocations();
    for (const organizationLocation of organizationLocations) {
      const syncLocationId = organizationLocation.locationId;
      // retrieve assets
      const assets = await this.brProviderService.getAssets({
        location_id: syncLocationId,
      });
      // verify assets
      const validAssets = this.getValidAssetsForSync(syncLocationId, assets);
      if (validAssets.length) {
        await this.insertAssets(organizationLocation.organizationId, validAssets);
      }
    }
    console.log('Synced assets');
  }
}
