import { z } from "zod";

// Schema for organization form
const FormSchemaOrg = z.object({
  orgId: z
    .string()
    .nonempty(
      "Organization Slug is required, Please get it from Semgrep account.",
    ),
  apiKey: z
    .string()
    .nonempty(
      "API Access Token is required, Please generate it from Semgrep account.",
    ),
  syncPeriod: z.string().nonempty("Frequency selection is required."),
});

// Schema for API form
const FormSchemaAPI = z.object({
  product_id: z.string().min(1, "Product is required"),
  semgrep_project_id: z
    .array(z.string())
    .nonempty("At least one project is required"),
});

// Export both schemas
export { FormSchemaAPI, FormSchemaOrg };
