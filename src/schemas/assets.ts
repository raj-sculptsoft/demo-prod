import { z } from "zod";

const FormSchema = z.object({
  asset_name: z.string().min(1, "Asset Name is required"),
  program_language_all_data: z
    .array(z.string())
    .min(1, "At least one programming language is required"),
});

export default FormSchema;
