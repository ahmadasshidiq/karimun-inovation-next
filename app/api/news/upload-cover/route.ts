import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { ensureMinioBucket, ensurePublicNewsCovers, getMinioClient, minioBucket, minioPublicUrl } from "@/lib/minio";
import { NEWS_PERMISSION } from "@/lib/news";
import { hasPermission } from "@/lib/permission";

const MAX_COVER_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const hasValidImageSignature = (bytes: Uint8Array, type: string) => {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index]);
  return type === "image/webp" && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
};

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !hasPermission(user.role.permission, NEWS_PERMISSION.model, NEWS_PERMISSION.action)) {
    return NextResponse.json({ message: "Tidak memiliki akses berita." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || !file.size) return NextResponse.json({ message: "Gambar cover wajib dipilih." }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_COVER_SIZE) return NextResponse.json({ message: "Cover harus JPG, PNG, atau WebP dengan ukuran maksimal 2 MB." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasValidImageSignature(buffer, file.type)) return NextResponse.json({ message: "Berkas gambar cover tidak valid." }, { status: 400 });

    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const objectName = `news/covers/${user.id}/${crypto.randomUUID()}.${extension}`;
    await ensureMinioBucket();
    await ensurePublicNewsCovers();
    await getMinioClient().putObject(minioBucket, objectName, buffer, buffer.length, { "Content-Type": file.type });

    return NextResponse.json({ message: "Cover berhasil diunggah.", data: { url: minioPublicUrl(objectName) } }, { status: 201 });
  } catch (error) {
    console.error("News cover upload failed", error);
    if (error instanceof Error && error.message === "Konfigurasi MinIO belum lengkap.") {
      return NextResponse.json(
        { message: "Penyimpanan gambar belum dikonfigurasi. Lengkapi variabel MINIO di environment server." },
        { status: 503 },
      );
    }
    return NextResponse.json({ message: "Gagal mengunggah cover berita." }, { status: 500 });
  }
}
