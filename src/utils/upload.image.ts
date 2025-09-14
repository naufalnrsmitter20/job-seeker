import { UploadApiResponse } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

import cloudinary from "@/lib/cloudinary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function UploadImageCloudinary(file: Buffer | any) {
  try {
    if (!file || (!file.data && !file.length)) {
      return { error: true, message: "No file provided or file is empty" };
    }
    const upload: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ upload_preset: "ml_default", quality: "auto:best", resource_type: "image" }, (error, result) => {
          if (error) reject(error);
          return resolve(result);
        })
        .end(file?.data ? file.data : file);
    });

    if (!upload) return { error: true, message: "Gagal Upload!" };

    const data = {
      format: upload.format,
      url: upload.url,
    };

    return { error: false, message: "Upload sukses", data };
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function UploadFileCloudinary(file: File | Buffer | any) {
  try {
    if (!file || (!file.data && !file.length && !file.name)) {
      return { error: true, message: "No file provided or file is empty" };
    }

    // Ambil nama file asli, fallback ke "file.pdf"
    const originalName = (file.name ? file.name.split(" ").join("_") : "file.pdf") || "file.pdf";

    const publicId = `portfolio/${uuidv4()}`;

    const upload: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "ml_default",
            resource_type: "auto", // ✅ pakai auto, biar support PDF & image
            public_id: publicId,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(file?.data ? file.data : file);
    });

    if (!upload) return { error: true, message: "Gagal Upload!" };

    // URL preview (bisa dibuka langsung di browser)
    const previewUrl = upload.secure_url;

    // URL download (paksa download dengan nama asli)
    const downloadUrl = previewUrl.replace("/upload/", `/upload/fl_attachment:${encodeURIComponent(originalName)}/`);

    return {
      error: false,
      message: "Upload sukses",
      data: {
        previewUrl,
        downloadUrl,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

export const ValidateFileSize = (file: File) => {
  const fileSizeInMB = file.size / (1024 * 1024);
  return fileSizeInMB;
};
