import { PaginatedListCommonResponse } from "./common";
import { Product } from "./products";

export interface AssetData extends PaginatedListCommonResponse {
  list: Asset[];
}

export interface Asset {
  asset_id: string;
  asset_name: string;
  program_language: string;
  product_id: string;
  no_of_vulnerability: number;
  no_of_file: number;
  products: Product;
  program_language_data: ProgramLanguageData;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by: string;
}

export interface ProgramLanguageData {
  master_enum_uuid: string;
  master_enum_type_id: number;
  master_enum_id: number;
  master_enum_name: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_archived: boolean;
}
