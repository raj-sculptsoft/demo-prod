// Types for the Settings and TargetList

export interface Settings {
  company_id: string;
  third_party_integrations_id: string;
  integration_data: IntegrationData;
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
  snyk_target_id: string;
  snyk_target_name: string;
}

export interface LinkAssets {
  success: number;
  message: string;
  data: null;
}
