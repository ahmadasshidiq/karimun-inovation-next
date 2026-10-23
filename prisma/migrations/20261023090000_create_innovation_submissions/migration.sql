CREATE TABLE "competition_periods" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "deleted_at" TIMESTAMPTZ(3),
  CONSTRAINT "competition_periods_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "competition_periods_start_date_end_date_idx" ON "competition_periods"("start_date", "end_date");
CREATE INDEX "competition_periods_deleted_at_idx" ON "competition_periods"("deleted_at");

CREATE TABLE "innovation_submissions" (
  "id" UUID NOT NULL,
  "innovation_id" UUID NOT NULL,
  "track" VARCHAR(30) NOT NULL,
  "period_id" UUID,
  "status" VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
  "submitted_by" UUID NOT NULL,
  "submitted_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "cancelled_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "innovation_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "innovation_submissions_innovation_id_idx" ON "innovation_submissions"("innovation_id");
CREATE INDEX "innovation_submissions_track_status_idx" ON "innovation_submissions"("track", "status");
CREATE INDEX "innovation_submissions_period_id_idx" ON "innovation_submissions"("period_id");

ALTER TABLE "innovation_submissions" ADD CONSTRAINT "innovation_submissions_innovation_id_fkey"
  FOREIGN KEY ("innovation_id") REFERENCES "innovations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "innovation_submissions" ADD CONSTRAINT "innovation_submissions_period_id_fkey"
  FOREIGN KEY ("period_id") REFERENCES "competition_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "innovation_submissions" ADD CONSTRAINT "innovation_submissions_submitted_by_fkey"
  FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
