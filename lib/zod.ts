import { z } from "zod";
import { MAX_FILE_SIZE } from "@/constants";

export const UploadSchema = z.object({
  pdfFile: z
    .any()
    .refine((f) => f instanceof File, "A PDF file is required")
    .refine(
      (f) => !(f instanceof File) || f.size <= MAX_FILE_SIZE,
      "File must be under 50MB"
    ),
  coverImage: z.any().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  voiceId: z.string().min(1, "Please select a voice"),
});
