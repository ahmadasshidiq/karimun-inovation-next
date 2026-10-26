// Indikator wajib dipenuhi sebelum inovasi dikirim ke Perjanjian Kinerja atau Lomba Inovasi.
export const MANDATORY_INDICATORS = {
  1: "Regulasi Inovasi Daerah",
  2: "Ketersediaan dan peran SDM terhadap inovasi daerah",
  17: "Kecepatan penciptaan inovasi",
  18: "Kemanfaatan inovasi",
  20: "Video inovasi daerah",
} as const;

export const MANDATORY_INDICATOR_IDS = Object.keys(MANDATORY_INDICATORS).map(
  Number,
);

export const isMandatoryIndicator = (indicatorId: number) =>
  MANDATORY_INDICATOR_IDS.includes(indicatorId);

// Indikator dianggap terpenuhi jika parameter sudah dipilih dan ada dokumen pendukung.
export const getMissingMandatoryIndicators = (
  assessments: { indicatorId: number; documentCount: number }[],
) =>
  MANDATORY_INDICATOR_IDS.filter(
    (indicatorId) =>
      !assessments.some(
        (assessment) =>
          assessment.indicatorId === indicatorId &&
          assessment.documentCount > 0,
      ),
  );

// Indikator "Video inovasi daerah": berisi video penerapan dan cover thumbnail.
export const VIDEO_INDICATOR_ID = 20;
