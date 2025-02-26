export interface Settings {
  company_id: string;
  third_party_integrations_id: string;
  integration_data: IntegrationData;
  sync_period: number | null;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationData {
  snyk_api_keys: {
    organization_id: string;
    api_access_key: string;
  };
  semgrep_api_keys: {
    Organization_slug: string;
    api_token: string;
  };
}

export interface SyncPayload {
  company_id: string;
  third_party_integrations_id: string | null;
  integration_data: {
    snyk_api_keys: {
      organization_id: null;
      api_access_key: null;
    };
    semgrep_api_keys: {
      Organization_slug: string;
      api_token: string;
    };
  };
  sync_period: number | null;
}

export interface TargetList {
  list: List[];
  success: number;
  message: string;
  data: TargetData;
}

export interface TargetData {
  list: List[];
}
export interface List {
  semgrep_project_id: string;
  semgrep_project_name: string;
}
export interface LinkAssets {
  success: number;
  message: string;
  data: DataAsset;
  list: ListAsset[];
}

export interface DataAsset {
  list: ListAsset[];
}

export interface ListAsset {
  product_id: string;
  asset_id: string;
  project_id: string;
  project_name: string;
  status_id: string;
}

export interface ProjectLink {
  success: number;
  message: string;
  data: Data;
  products: Product[];
}

export interface Data {
  products: Product[];
}

export interface Product {
  product_id: string;
  product_name: string;
  projects: Project[];
}

export interface Project {
  project_id: string;
  project_name: string;
  program_language: string[];
}

export interface FetchStatusResponse {
  status: string;
  success: number;
  message: string;
  data: {
    status: string;
  };
}
