import { PaginatedListCommonResponse } from "./common";

export interface ProductData extends PaginatedListCommonResponse {
  list: Product[];
}

export interface Product {
  product_id: string;
  company_id: string;
  product_name: string;
  product_description: string;
  product_domain: string;
  target_audience: string;
  product_live: string | null;
  revenue_impact: string | null;
  customer_data_type: string | null;
  compliance_required: string | null;
  dependency_impact: string | null;
  system_architech: string | null;
  no_of_asset: number;
  company: Company;
  target_audience_data: TargetAudienceData;
  created_by: string;
  updated_by: string;
  is_active: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  company_name: string;
  address: string;
  phone_number: string;
  email: string;
  website: string;
  industry: string;
  logo: string;
  time_zone: string;
  company_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_archived: boolean;
}

export interface TargetAudienceData {
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
