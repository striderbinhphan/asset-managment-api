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
  async processSyncAssetsToDb(organizationId: number, asserts: GetAssetResponse[]) {
    const chunks = chunk(asserts, 100);
    // sync assets by chunk
    for (const chunk of chunks) {
      const insertedAssets = await this.prismaService.asset.findMany({where: {id: {in: chunk.map((a) => +a.id)}}});
      console.log(insertedAssets.length);
      await this.prismaService.$transaction(async (trx) => {
        const newAssets = [];
        for (const asset of chunk) {
          const insertedAsset = insertedAssets.find((insertedAsset) => insertedAsset.id == asset.id);
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
                createdAt: new Date(asset.created_at),
                updatedAt: new Date(asset.updated_at),
              },
            });
          } else {
            newAssets.push({
              ...baseAssetInfo,
              id: +asset.id,
              organizationId,
              locationId: asset.location_id,
              updatedAt: new Date(asset.updated_at),
            });
          }
        }

        // insert new assets by batch to optimize query
        if (newAssets.length) {
          console.log(newAssets);
          await trx.asset.createMany({data: newAssets});
        }
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncDailyAssets() {
    console.log('Syncing assets');
    // get all organization
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
        await this.processSyncAssetsToDb(organizationLocation.organizationId, validAssets);
      }
    }
    console.log('Synced assets');
  }
}
