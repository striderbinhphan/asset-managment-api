import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {firstValueFrom} from 'rxjs';
import {GetAssetResponse, GetAssetsParams} from './br-provider.interface';
@Injectable()
export class BRProviderService {
  private baseURL = 'https://669ce22d15704bb0e304842d.mockapi.io';
  constructor(private readonly httpService: HttpService) {}

  async getAssets(params: GetAssetsParams): Promise<GetAssetResponse[]> {
    try {
      const axiosResponse = await firstValueFrom(
        this.httpService.get<GetAssetResponse[]>(`${this.baseURL}/assets`, {
          params,
        }),
      );
      console.log(axiosResponse.data);
      return axiosResponse.data;
    } catch (error) {
      console.error(error?.message);
      return [];
    }
  }
}
