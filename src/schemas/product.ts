import { z } from "zod";

const FormSchema = z.object({
  product_name: z.string().min(1, "Product Name is required"),
  product_description: z.string().min(1, "Product Description is required"),
  product_domain: z.string().min(1, "Business Domain is required"),
  target_audience: z.string().min(1, "Target Audience is required"),
  system_architech: z.string().optional(),
  product_live: z.string().optional(),
  revenue_impact: z.string().optional(),
  customer_data_type: z.string().optional(),
  compliance_required: z.string().optional(),
  dependency_impact: z.string().optional(),
});

export default FormSchema;
