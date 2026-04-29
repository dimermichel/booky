import { z } from "zod";
import { MAX_FILE_SIZE, MAX_IMAGE_SIZE } from "@/constants";

export const UploadSchema = z.object({
  pdfFile: z
    .instanceof(File, { message: "A PDF file is required" })
    .refine((f) => f.type === "application/pdf", "File must be a PDF")
    .refine((f) => f.size <= MAX_FILE_SIZE, "File must be under 50MB"),
  coverImage: z
    .instanceof(File)
    .refine((f) => f.type.startsWith("image/"), "File must be an image")
    .refine((f) => f.size <= MAX_IMAGE_SIZE, "Image must be under 10MB")
    .optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  voiceId: z.string().min(1, "Please select a voice"),
});
