import { Client } from "minio";

export const minioBucket = process.env.MINIO_BUCKET_AVATARS || "iga-project";

export const getMinioClient = () => {
  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  if (!endpoint || !accessKey || !secretKey)
    throw new Error("Konfigurasi MinIO belum lengkap.");
  return new Client({ endPoint: endpoint, port: Number(process.env.MINIO_PORT || 443), useSSL: process.env.MINIO_USE_SSL !== "false", accessKey, secretKey });
};

export const minioPublicUrl = (objectName: string) => {
  const base = (process.env.MINIO_PUBLIC_URL || "").replace(/\/$/, "");
  return `${base}/${minioBucket}/${objectName}`;
};

export async function ensureMinioBucket() {
  const minio = getMinioClient();
  if (!(await minio.bucketExists(minioBucket))) {
    await minio.makeBucket(minioBucket);
  }
}
