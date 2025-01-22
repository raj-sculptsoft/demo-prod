import { z } from "zod";

const FormSchema = z.object({
  asset_name: z.string().min(1, "Asset Name is required"),
  program_language: z.string().min(1, "Programming Language is required"),
});

export default FormSchema;
