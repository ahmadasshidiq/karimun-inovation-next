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

/** Membuka akses baca publik hanya untuk cover Berita, bukan seluruh bucket. */
export async function ensurePublicNewsCovers() {
  const minio = getMinioClient();
  let policy: { Version?: string; Statement?: Array<Record<string, unknown>> } = {};

  try {
    policy = JSON.parse(await minio.getBucketPolicy(minioBucket)) as typeof policy;
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
    if (code !== "NoSuchBucketPolicy" && !String(error).includes("policy does not exist")) {
      throw error;
    }
  }

  const statements = (policy.Statement || []).filter(
    (statement) => statement.Sid !== "PublicReadNewsCovers",
  );
  statements.push({
    Sid: "PublicReadNewsCovers",
    Effect: "Allow",
    Principal: { AWS: ["*"] },
    Action: ["s3:GetObject"],
    Resource: [`arn:aws:s3:::${minioBucket}/news/covers/*`],
  });

  await minio.setBucketPolicy(
    minioBucket,
    JSON.stringify({ Version: policy.Version || "2012-10-17", Statement: statements }),
  );
}
