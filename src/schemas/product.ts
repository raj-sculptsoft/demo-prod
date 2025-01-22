import { z } from "zod";

const FormSchema = z.object({
  product_name: z.string().min(1, "Product Name is required"),
  product_description: z.string().min(1, "Product Description is required"),
  product_domain: z.string().min(1, "Business Domain is required"),
  target_audience: z.string().min(1, "Target Audience is required"),
  system_architech: z.string().min(1, "System Architecture is required"),
});

export default FormSchema;
