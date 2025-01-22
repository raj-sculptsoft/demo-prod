import { Asset } from "./assets";
import { Product } from "./products";

export interface UploadReportResponse {
  product_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  is_archived: boolean;
  report_id: string;
  asset_id: string;
  file_path: string;
  status: string;
  updated_at: string;
  products: Product;
  assets: Asset;
}

export interface FetchReportResponse {
  status: string;
  success: number;
  message: string;
  data: {
    status: string;
  };
}
