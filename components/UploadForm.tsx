"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ImageIcon, X, Loader2 } from "lucide-react";
import { voiceOptions, voiceCategories, DEFAULT_VOICE } from "@/constants";

const MAX_PDF_SIZE = 50 * 1024 * 1024;

const formSchema = z.object({
  pdfFile: z
    .any()
    .refine((f) => f instanceof File, "A PDF file is required")
    .refine(
      (f) => !(f instanceof File) || f.size <= MAX_PDF_SIZE,
      "File must be under 50MB"
    ),
  coverImage: z.any().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  voiceId: z.string().min(1, "Please select a voice"),
});

type FormValues = z.infer<typeof formSchema>;

const UploadForm = () => {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceId: voiceOptions[DEFAULT_VOICE as keyof typeof voiceOptions].id,
    },
  });

  const pdfFile = watch("pdfFile") as File | undefined;
  const coverImage = watch("coverImage") as File | undefined;
  const voiceId = watch("voiceId");

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      {isSubmitting && (
        <div className="loading-wrapper">
          <div className="loading-shadow-wrapper bg-white">
            <div className="loading-shadow">
              <Loader2 className="loading-animation w-12 h-12 text-[var(--color-brand)]" />
              <p className="loading-title">Synthesizing your book...</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="new-book-wrapper space-y-8"
      >
        {/* PDF Upload */}
        <div>
          <label className="form-label">Book PDF File</label>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("pdfFile", file, { shouldValidate: true });
            }}
          />
          <div
            className={`upload-dropzone border border-dashed border-[var(--border-medium)] ${pdfFile ? "upload-dropzone-uploaded" : ""}`}
            onClick={() => pdfInputRef.current?.click()}
          >
            {pdfFile ? (
              <div className="flex items-center gap-3">
                <span className="upload-dropzone-text truncate max-w-xs">
                  {pdfFile.name}
                </span>
                <button
                  type="button"
                  className="upload-dropzone-remove shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("pdfFile", undefined as any, {
                      shouldValidate: true,
                    });
                    if (pdfInputRef.current) pdfInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="upload-dropzone-icon" />
                <span className="upload-dropzone-text">Click to upload PDF</span>
                <span className="upload-dropzone-hint">PDF file (max 50MB)</span>
              </>
            )}
          </div>
          {errors.pdfFile && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.pdfFile.message)}
            </p>
          )}
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="form-label">Cover Image (Optional)</label>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("coverImage", file, { shouldValidate: true });
            }}
          />
          <div
            className={`upload-dropzone border border-dashed border-[var(--border-medium)] ${coverImage ? "upload-dropzone-uploaded" : ""}`}
            onClick={() => coverInputRef.current?.click()}
          >
            {coverImage ? (
              <div className="flex items-center gap-3">
                <span className="upload-dropzone-text truncate max-w-xs">
                  {coverImage.name}
                </span>
                <button
                  type="button"
                  className="upload-dropzone-remove shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("coverImage", undefined, { shouldValidate: true });
                    if (coverInputRef.current) coverInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="upload-dropzone-icon" />
                <span className="upload-dropzone-text">
                  Click to upload cover image
                </span>
                <span className="upload-dropzone-hint">
                  Leave empty to auto-generate from PDF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="form-label">Title</label>
          <input
            {...register("title")}
            type="text"
            placeholder="ex: Rich Dad Poor Dad"
            className="form-input"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Author Name */}
        <div>
          <label className="form-label">Author Name</label>
          <input
            {...register("author")}
            type="text"
            placeholder="ex: Robert Kiyosaki"
            className="form-input"
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
          )}
        </div>

        {/* Voice Selector */}
        <div>
          <label className="form-label">Choose Assistant Voice</label>

          <div className="mb-4">
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Male Voices
            </p>
            <div className="voice-selector-options">
              {voiceCategories.male.map((key) => {
                const voice =
                  voiceOptions[key as keyof typeof voiceOptions];
                const isSelected = voiceId === voice.id;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setValue("voiceId", voice.id, { shouldValidate: true })
                    }
                    className={`voice-selector-option ${isSelected ? "voice-selector-option-selected" : "voice-selector-option-default"}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-[var(--accent-warm)]" : "border-[var(--border-medium)]"}`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
                      )}
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-[var(--text-primary)] text-base leading-5">
                        {voice.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {voice.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Female Voices
            </p>
            <div className="voice-selector-options">
              {voiceCategories.female.map((key) => {
                const voice =
                  voiceOptions[key as keyof typeof voiceOptions];
                const isSelected = voiceId === voice.id;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setValue("voiceId", voice.id, { shouldValidate: true })
                    }
                    className={`voice-selector-option ${isSelected ? "voice-selector-option-selected" : "voice-selector-option-default"}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-[var(--accent-warm)]" : "border-[var(--border-medium)]"}`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
                      )}
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-[var(--text-primary)] text-base leading-5">
                        {voice.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {voice.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {errors.voiceId && (
            <p className="text-red-500 text-sm mt-2">
              {errors.voiceId.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="form-btn" disabled={isSubmitting}>
          Begin Synthesis
        </button>
      </form>
    </>
  );
};

export default UploadForm;
