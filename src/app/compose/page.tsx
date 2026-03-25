"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1920;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export default function ComposePage() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { user, profile } = useAuth();
  const { t } = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const partnerId = profile?.partner_id ?? null;
  const partnerNickname = profile?.partner_nickname ?? "";

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;
    const selected = files.slice(0, remaining);

    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(t("compose.imageTooLarge"));
      return;
    }

    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...selected]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setError("");

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!partnerId || !user) return;
    setLoading(true);
    setError("");

    const supabase = createClient();

    // 1. Insert letter
    const { data: letterData, error: letterError } = await supabase
      .from("letters")
      .insert({
        author_id: user.id,
        recipient_id: partnerId,
        content: content.trim(),
      })
      .select("id")
      .single();

    if (letterError || !letterData) {
      setError(t("compose.failed"));
      setLoading(false);
      return;
    }

    const letterId = letterData.id;

    // 2. Upload images
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        try {
          const compressed = await compressImage(images[i]);
          const ext = "jpg";
          const storagePath = `${user.id}/${letterId}/${crypto.randomUUID()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("letter-images")
            .upload(storagePath, compressed, { contentType: "image/jpeg" });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            continue;
          }

          await supabase.from("letter_images").insert({
            letter_id: letterId,
            storage_path: storagePath,
            display_order: i,
          });
        } catch (err) {
          console.error("Image processing error:", err);
        }
      }
    }

    // Cleanup previews
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setSent(true);
    setLoading(false);
  }

  if (!partnerId) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-500">{t("compose.noPair")}</p>
          <a
            href="/pair"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {t("compose.goPair")}
          </a>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t("compose.sent")}</h1>
          <p className="text-gray-500">{t("compose.sentTo")} {partnerNickname}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSent(false); setContent(""); setImages([]); setImagePreviews([]); }}
              className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              {t("compose.writeAnother")}
            </button>
            <a
              href="/timeline"
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {t("compose.timeline")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold mb-1">{t("compose.title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("compose.to")} {partnerNickname}</p>

      <form onSubmit={handleSend} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          placeholder={t("compose.placeholder")}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
        />

        {/* Image selection area */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          {imagePreviews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img
                    src={src}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white hover:bg-gray-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              {t("compose.addImage")} ({images.length}/{MAX_IMAGES})
            </button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{content.length} {t("compose.chars")}</span>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || content.trim().length === 0}
          className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? t("compose.loading") : t("compose.submit")}
        </button>
      </form>
    </div>
  );
}
