import { z } from "zod";

// Schema for organization form
const FormSchemaOrg = z.object({
  orgId: z
    .string()
    .nonempty("Organization ID is required")
    .length(36, "Organization ID must be exactly 36 characters"),
  apiKey: z
    .string()
    .nonempty("API Access Key is required")
    .length(36, "Organization ID must be exactly 36 characters"),
});

// Schema for API form
const FormSchemaAPI = z.object({
  product_id: z.string().min(1, "Product is required"),
  snyk_target_id: z
    .array(z.string())
    .nonempty("At least one target is required"),
});

// Export both schemas
export { FormSchemaAPI, FormSchemaOrg };
