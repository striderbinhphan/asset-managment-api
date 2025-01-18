export interface GetAssetsParams {
  location_id: number;
}

export interface GetAssetResponse {
  type: string;
  serial: string;
  status: string;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
  id: number;
}
