// export interface DashboardStats {
//   total_products: number;
//   total_vulnerabilities: number;
//   total_false_positives: number;
//   total_true_positives: number;
//   total_hours_saved: number;
//   total_files: number;
//   total_assets: number;
//   critical_count: number;
//   high_count: number;
//   medium_count: number;
//   low_count: number;
// }

export interface DashboardStats {
  total_products: number;
  total_vulnerabilities: number;
  total_false_positives: number;
  total_true_positives: number;
  total_hours_saved: number;
  total_files: number;
  total_assets: number;
  critical_false_count: number;
  critical_true_count: number;
  high_false_count: number;
  high_true_count: number;
  medium_false_count: number;
  medium_true_count: number;
  low_false_count: number;
  low_true_count: number;
}

export interface DashboardVulnerabilities {
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export interface DashboardVulnerabilitiesDetailsList {
  list: DashboardVulnerabilitiesDetails[];
}

export interface DashboardVulnerabilitiesDetails {
  id: number;
  vulnerability_name: string;
  severity: string;
  impact: string;
  count: number;
}

export interface DashboardTopVulnerabilityList {
  list: DashboardTopVulnerability[];
}

export interface DashboardTopVulnerability {
  product_name: string | undefined;
  product_id: string | undefined;
  total_vulnerabilities: number;
  asset_name: string | undefined;
  asset_id: string | undefined;
  vulnerability_file_name: string | undefined;
  vulnerabilities: VulnerabilityDetail[];
}

export interface VulnerabilityDetail {
  vulnerability_name: string;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  false_positive_count: number;
}
export interface DashboardRiskMatrix {
  risk_matrix: DashboardRiskMatrixCount;
}
export interface Risk<T> {
  Critical: T;
  High: T;
  Low: T;
  Medium: T;
}
export type DashboardRiskMatrixCount = {
  Critical: Record<"Critical" | "High" | "Medium" | "Low", number>;
  High: Record<"Critical" | "High" | "Medium" | "Low", number>;
  Medium: Record<"Critical" | "High" | "Medium" | "Low", number>;
  Low: Record<"Critical" | "High" | "Medium" | "Low", number>;
};
