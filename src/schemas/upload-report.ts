import { z } from "zod";

const validMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
  "application/json",
];

const FormSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  asset_id: z.string().min(1, "Asset is required"),
  file: z
    .any()
    .refine((val) => val?.name, "Report is required")
    .refine(
      (file) => {
        return validMimeTypes.includes(file?.type);
      },
      {
        message: "Invalid file type. Allowed types: PDF, CSV, JSON",
      },
    ),
});

export default FormSchema;
