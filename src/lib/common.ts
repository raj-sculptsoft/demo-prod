export const impactColor = {
  Critical: "border-red bg-red-lighter text-red",
  High: "border-orange-chart bg-orange-lighter text-orange-chart",
  Medium: "border-yellow bg-yellow-light text-yellow",
  Low: "border-green bg-green-lighter text-green",
};

export function getSelectOptions<T>(
  data: Array<T>,
  labelKey: keyof T,
  valueKey: keyof T,
) {
  return data?.map?.((val) => ({
    label: val[labelKey] as string,
    value: val[valueKey] as string,
  }));
}

export const defaultPayloadForWithoutPagination = {
  search: null,
  order_by: "created_at",
  sort_by: "asc",
  page_index: 0,
  page_size: 0,
};

export enum SelectsEnum {
  Target_Audience = 1,
  Programming_Language = 2,
  Positivity = 4,
  FalsePositivityReason = 5,
  TruePositivityReason = 6,
  Product_Live = 8,
  Revenue_Impact = 9,
  Customer_Data_Type = 10,
  Compliance_Required = 11,
  Dependency_Impact = 12,
}

export enum VULNERABILITY_DETAILS_SOURCE {
  PRODUCT = "product",
  VULNERABILITY = "vulnerability",
}
