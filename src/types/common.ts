import { SVGProps } from "react";

export type SVGElementProps = SVGProps<SVGSVGElement>;

export type Params = Promise<{ slug: string }>;
export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface CommonFormFieldsProps {
  name: string;
  label: string;
  placeholder: string;
  onChange?: (value: string) => void;
}

export interface PaginatedListCommonResponse {
  page_index: number;
  page_size: number;
  total_count: number;
}

export interface StaticSelectOptions {
  master_enum_type_id: number;
  updated_by: string;
  updated_at: string;
  is_active: boolean;
  master_enum_id: number;
  master_enum_uuid: string;
  master_enum_name: string;
  created_by: string;
  created_at: string;
  is_archived: boolean;
}

export interface IdParams {
  productId: string;
  assetId: string;
  vulnerabilityId: string;
}

export interface CommonDashboardProps {
  company_id: string;
  product_id?: string;
  asset_id?: string;
}

export interface PriorityCounts {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface AddUpdateEnum {
  master_enum_uuid: string;
  master_enum_type_id: number;
  master_enum_name: string;
  master_enum_id: number;
  created_by: null;
  updated_by: null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_archived: boolean;
}
