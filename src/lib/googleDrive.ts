import { google } from "googleapis";
import { Readable } from "stream";

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export async function UploadFileGoogleDriveShared(buffer: Buffer, mimeType: string, originalName: string, folderId?: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileMeta: any = {
      name: originalName,
      parents: folderId ? [folderId] : undefined, // folder di dalam Shared Drive
    };

    const media = {
      mimeType,
      body: Readable.from(buffer),
    };

    const res = await drive.files.create({
      requestBody: fileMeta,
      media,
      fields: "id, name, webViewLink, webContentLink, driveId",
      supportsAllDrives: true, // wajib kalau pakai Shared Drive
    });

    const fileId = res.data.id;

    // kasih permission publik (kalau memang mau)
    await drive.permissions.create({
      fileId: fileId!,
      supportsAllDrives: true,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return {
      error: false,
      message: "Upload sukses",
      data: {
        id: fileId,
        name: res.data.name,
        previewUrl: res.data.webViewLink,
        downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`,
      },
    };
  } catch (err) {
    console.error("Google Drive Shared upload error:", err);
    return { error: true, message: "Upload gagal" };
  }
}
