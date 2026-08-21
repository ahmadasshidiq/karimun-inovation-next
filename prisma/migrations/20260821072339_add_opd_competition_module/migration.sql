-- CreateEnum
CREATE TYPE "CompetitionPeriodStatus" AS ENUM ('DRAFT', 'REGISTRATION', 'VERIFICATION', 'ASSESSMENT', 'FINALIZATION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CompetitionParticipantStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'WAITING_VERIFICATION', 'NEEDS_REVISION', 'RESUBMITTED', 'VERIFIED', 'REJECTED', 'UNDER_ASSESSMENT', 'ASSESSED', 'FINALIST');

-- CreateEnum
CREATE TYPE "CompetitionDocumentStatus" AS ENUM ('UNVERIFIED', 'VALID', 'NEEDS_REVISION', 'REJECTED');

-- CreateEnum
CREATE TYPE "CompetitionAssessmentStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateTable
CREATE TABLE "competition_periods" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "registration_start" DATE NOT NULL,
    "registration_end" DATE NOT NULL,
    "verification_start" DATE NOT NULL,
    "verification_end" DATE NOT NULL,
    "assessment_start" DATE NOT NULL,
    "assessment_end" DATE NOT NULL,
    "announcement_date" DATE NOT NULL,
    "status" "CompetitionPeriodStatus" NOT NULL DEFAULT 'DRAFT',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "competition_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_participants" (
    "id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "innovation_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "status" "CompetitionParticipantStatus" NOT NULL DEFAULT 'DRAFT',
    "final_score" DECIMAL(6,2),
    "submitted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "competition_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_documents" (
    "id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "document_date" DATE,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "status" "CompetitionDocumentStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competition_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_verifications" (
    "id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "verifier_id" UUID NOT NULL,
    "checklist" JSONB NOT NULL,
    "notes" TEXT,
    "decision" "CompetitionParticipantStatus" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competition_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_indicators" (
    "id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(5,2) NOT NULL,
    "min_score" INTEGER NOT NULL DEFAULT 0,
    "max_score" INTEGER NOT NULL DEFAULT 100,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "competition_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_judge_assignments" (
    "id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "judge_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competition_judge_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_assessments" (
    "id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "judge_id" UUID NOT NULL,
    "status" "CompetitionAssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "total_score" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "competition_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_assessment_scores" (
    "id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "indicator_id" UUID NOT NULL,
    "score" DECIMAL(6,2) NOT NULL,
    "weighted_score" DECIMAL(6,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "competition_assessment_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_results" (
    "id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "rank" INTEGER NOT NULL,
    "award_category" VARCHAR(100) NOT NULL,
    "final_score" DECIMAL(6,2) NOT NULL,
    "finalized_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalized_by" UUID NOT NULL,

    CONSTRAINT "competition_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_activity_logs" (
    "id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "activity" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competition_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "competition_periods_year_idx" ON "competition_periods"("year");

-- CreateIndex
CREATE INDEX "competition_periods_is_active_idx" ON "competition_periods"("is_active");

-- CreateIndex
CREATE INDEX "competition_participants_institution_id_idx" ON "competition_participants"("institution_id");

-- CreateIndex
CREATE INDEX "competition_participants_status_idx" ON "competition_participants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "competition_participants_period_id_innovation_id_key" ON "competition_participants"("period_id", "innovation_id");

-- CreateIndex
CREATE INDEX "competition_documents_participant_id_idx" ON "competition_documents"("participant_id");

-- CreateIndex
CREATE INDEX "competition_verifications_participant_id_idx" ON "competition_verifications"("participant_id");

-- CreateIndex
CREATE INDEX "competition_indicators_period_id_is_active_idx" ON "competition_indicators"("period_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "competition_judge_assignments_participant_id_judge_id_key" ON "competition_judge_assignments"("participant_id", "judge_id");

-- CreateIndex
CREATE UNIQUE INDEX "competition_assessments_participant_id_judge_id_key" ON "competition_assessments"("participant_id", "judge_id");

-- CreateIndex
CREATE UNIQUE INDEX "competition_assessment_scores_assessment_id_indicator_id_key" ON "competition_assessment_scores"("assessment_id", "indicator_id");

-- CreateIndex
CREATE UNIQUE INDEX "competition_results_participant_id_key" ON "competition_results"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "competition_results_period_id_rank_key" ON "competition_results"("period_id", "rank");

-- CreateIndex
CREATE INDEX "competition_activity_logs_participant_id_created_at_idx" ON "competition_activity_logs"("participant_id", "created_at");

-- AddForeignKey
ALTER TABLE "competition_participants" ADD CONSTRAINT "competition_participants_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "competition_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_participants" ADD CONSTRAINT "competition_participants_innovation_id_fkey" FOREIGN KEY ("innovation_id") REFERENCES "innovations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_participants" ADD CONSTRAINT "competition_participants_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_participants" ADD CONSTRAINT "competition_participants_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_documents" ADD CONSTRAINT "competition_documents_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "competition_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_verifications" ADD CONSTRAINT "competition_verifications_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "competition_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_verifications" ADD CONSTRAINT "competition_verifications_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_indicators" ADD CONSTRAINT "competition_indicators_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "competition_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_judge_assignments" ADD CONSTRAINT "competition_judge_assignments_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "competition_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_judge_assignments" ADD CONSTRAINT "competition_judge_assignments_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_judge_assignments" ADD CONSTRAINT "competition_judge_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_assessments" ADD CONSTRAINT "competition_assessments_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "competition_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_assessments" ADD CONSTRAINT "competition_assessments_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_assessment_scores" ADD CONSTRAINT "competition_assessment_scores_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "competition_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_assessment_scores" ADD CONSTRAINT "competition_assessment_scores_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "competition_indicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_results" ADD CONSTRAINT "competition_results_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "competition_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_results" ADD CONSTRAINT "competition_results_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "competition_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_results" ADD CONSTRAINT "competition_results_finalized_by_fkey" FOREIGN KEY ("finalized_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_activity_logs" ADD CONSTRAINT "competition_activity_logs_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "competition_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_activity_logs" ADD CONSTRAINT "competition_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Default active competition period and configurable indicators.
INSERT INTO "competition_periods" ("id", "name", "year", "registration_start", "registration_end", "verification_start", "verification_end", "assessment_start", "assessment_end", "announcement_date", "status", "is_active", "updated_at")
VALUES ('20260000-0000-4000-8000-000000000001', 'Lomba Inovasi OPD Kabupaten Karimun 2026', 2026, '2026-08-01', '2026-09-30', '2026-10-01', '2026-10-10', '2026-10-11', '2026-10-20', '2026-10-25', 'REGISTRATION', true, CURRENT_TIMESTAMP);

INSERT INTO "competition_indicators" ("id", "period_id", "name", "description", "weight", "position") VALUES
('20260000-0000-4000-8100-000000000001', '20260000-0000-4000-8000-000000000001', 'Kebaruan Inovasi', 'Menilai unsur kebaruan dibanding proses sebelumnya.', 15, 1),
('20260000-0000-4000-8100-000000000002', '20260000-0000-4000-8000-000000000001', 'Kemanfaatan', 'Menilai manfaat inovasi bagi masyarakat dan organisasi.', 20, 2),
('20260000-0000-4000-8100-000000000003', '20260000-0000-4000-8000-000000000001', 'Dampak', 'Menilai dampak terukur dari penerapan inovasi.', 20, 3),
('20260000-0000-4000-8100-000000000004', '20260000-0000-4000-8000-000000000001', 'Efektivitas', 'Menilai efektivitas pencapaian tujuan inovasi.', 15, 4),
('20260000-0000-4000-8100-000000000005', '20260000-0000-4000-8000-000000000001', 'Keberlanjutan', 'Menilai dukungan terhadap keberlanjutan inovasi.', 10, 5),
('20260000-0000-4000-8100-000000000006', '20260000-0000-4000-8000-000000000001', 'Potensi Replikasi', 'Menilai kemudahan inovasi untuk direplikasi.', 10, 6),
('20260000-0000-4000-8100-000000000007', '20260000-0000-4000-8000-000000000001', 'Kualitas Implementasi', 'Menilai kualitas pelaksanaan inovasi.', 10, 7);
