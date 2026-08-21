import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const assessmentGroups = [
  { subject: "Kelembagaan", indicators: [1, 2, 3, 4, 5], maximumScore: 10 },
  { subject: "Tata Kelola", indicators: [6, 7, 8, 9, 10], maximumScore: 6 },
  { subject: "Pelayanan", indicators: [11, 12, 13, 14, 15], maximumScore: 7 },
  { subject: "Dampak", indicators: [16, 17, 18], maximumScore: 8 },
  { subject: "Keberlanjutan", indicators: [19, 20], maximumScore: 6 },
];

const dateOnly = (value: Date | null) =>
  value ? value.toISOString().slice(0, 10) : "";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));

  const records = await prisma.innovation.findMany({
    where: { deletedAt: null },
    include: {
      createdBy: { include: { institution: true } },
      indicatorAssessments: { select: { indicatorId: true, score: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = records.map((item) => {
    const awardFile = Array.isArray(item.files)
      ? item.files.find(
        (file) =>
          typeof file === "object" &&
          file !== null &&
          "category" in file &&
          file.category === "award",
      )
      : null;

    return {
      id: item.id,
      organization: item.createdBy.institution.name,
      innovationName: item.name,
      innovationForm: item.innovationForm || "-",
      governmentAffair: item.governmentAffairs || "-",
      initiator: item.initiatorName || "-",
      stage: item.stage || "-",
      trialDate: dateOnly(item.trialPeriod),
      ImplementationDate: dateOnly(item.implementationPeriod),
      DevelopmentDate: item.isDevelopment ? dateOnly(item.updatedAt) : "",
      latitude: item.latitude?.toString() || "",
      longitude: item.longitude?.toString() || "",
      awardFileUrl:
        awardFile &&
        typeof awardFile === "object" &&
        "url" in awardFile &&
        typeof awardFile.url === "string"
          ? awardFile.url
          : "",
      awarded: Boolean(awardFile),
      skor: item.indicatorAssessments.reduce(
        (total, assessment) => total + Number(assessment.score),
        0,
      ),
    };
  });

  const filtered = mapped.filter((item) =>
    [
      ["organization", item.organization],
      ["innovationForm", item.innovationForm],
      ["governmentAffair", item.governmentAffair],
      ["initiator", item.initiator],
      ["stage", item.stage],
    ].every(([key, value]) => {
      const selected = params.get(key);
      return !selected || selected === "all" || selected === value;
    }),
  );

  const offset = (page - 1) * limit;
  const totalScore = mapped.reduce((total, item) => total + item.skor, 0);
  const innovationCount = mapped.length;
  const assessmentData = assessmentGroups.map((group) => {
    const score = records.reduce(
      (total, innovation) =>
        total +
        innovation.indicatorAssessments.reduce(
          (subtotal, assessment) =>
            group.indicators.includes(assessment.indicatorId)
              ? subtotal + Number(assessment.score)
              : subtotal,
          0,
        ),
      0,
    );
    const maximumScore = group.maximumScore * innovationCount;

    return {
      subject: group.subject,
      score,
      maximumScore,
      value: maximumScore > 0 ? (score / maximumScore) * 100 : 0,
    };
  });

  return NextResponse.json({
    data: filtered.slice(offset, offset + limit).map((item, index) => ({
      ...item,
      number: offset + index + 1,
    })),
    total: filtered.length,
    summary: {
      total: mapped.length,
      initiative: mapped.filter((item) => item.stage === "Inisiatif").length,
      trial: mapped.filter((item) => item.stage === "Uji Coba").length,
      implementation: mapped.filter((item) => item.stage === "Penerapan").length,
      award: mapped.filter((item) => item.awarded).length,
      totalScore,
      averageScore: mapped.length > 0 ? totalScore / mapped.length : 0,
    },
    mapData: mapped
      .filter(
        (item) =>
          Number.isFinite(Number(item.latitude)) &&
          Number.isFinite(Number(item.longitude)) &&
          item.latitude !== "" &&
          item.longitude !== "",
      )
      .map((item) => ({
        id: item.id,
        name: item.innovationName,
        institution: item.organization,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      })),
    assessmentData,
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  try {
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    if (typeof rawPayload !== "string") {
      return NextResponse.json({ message: "Data inovasi tidak valid." }, { status: 400 });
    }

    const payload = JSON.parse(rawPayload) as Record<string, unknown>;
    if (!String(payload.name || "").trim()) {
      return NextResponse.json({ message: "Nama inovasi wajib diisi." }, { status: 400 });
    }

    const categories = ["budget", "business-profile", "haki", "award"];
    const storedFiles: Array<Record<string, string | number>> = [];
    const uploadDirectory = path.join(process.cwd(), "public", "uploads", "innovations");

    for (let index = 0; index < categories.length; index += 1) {
      const file = formData.get(`file_${index}`);
      if (!(file instanceof File) || file.size === 0) continue;
      if (file.type !== "application/pdf" || file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "Dokumen harus berupa PDF dengan ukuran maksimal 2 MB." },
          { status: 400 },
        );
      }

      await mkdir(uploadDirectory, { recursive: true });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storedName = `${crypto.randomUUID()}-${safeName}`;
      await writeFile(
        path.join(uploadDirectory, storedName),
        Buffer.from(await file.arrayBuffer()),
      );
      storedFiles.push({
        category: categories[index],
        name: file.name,
        size: file.size,
        url: `/uploads/innovations/${storedName}`,
      });
    }

    const nullableDate = (value: unknown) =>
      value ? new Date(`${String(value)}T00:00:00.000Z`) : null;
    const nullableNumber = (value: unknown) =>
      value === "" || value === null || value === undefined
        ? null
        : Number(value);

    const innovation = await prisma.innovation.create({
      data: {
        name: String(payload.name).trim(),
        latitude: nullableNumber(payload.latitude),
        longitude: nullableNumber(payload.longitude),
        status: payload.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        initiatorType: String(payload.initiatorType || "") || null,
        initiatorName: String(payload.initiatorName || "") || null,
        type: String(payload.type || "") || null,
        stage: String(payload.stage || "") || null,
        classification: String(payload.classification || "") || null,
        innovationForm: String(payload.innovationForm || "") || null,
        thematic: String(payload.thematic || "") || null,
        pkpnCluster: String(payload.pkpnCluster || "") || null,
        pkpnSubCluster: String(payload.pkpnSubCluster || "") || null,
        governmentAffairs: String(payload.governmentAffairs || "") || null,
        trialPeriod: nullableDate(payload.trialPeriod),
        implementationPeriod: nullableDate(payload.implementationPeriod),
        isDevelopment: Boolean(payload.isDevelopment),
        description: String(payload.description || "") || null,
        purpose: String(payload.purpose || "") || null,
        files: storedFiles,
        createdById: user.id,
      },
    });

    return NextResponse.json(
      { message: "Inovasi berhasil disimpan.", data: { id: innovation.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create innovation failed", error);
    return NextResponse.json({ message: "Gagal menyimpan inovasi." }, { status: 500 });
  }
}
