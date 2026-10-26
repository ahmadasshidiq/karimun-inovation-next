ALTER TABLE "innovation_indicator_assessments" ADD COLUMN "review_status" VARCHAR(20) NOT NULL DEFAULT 'PENDING';
ALTER TABLE "innovation_indicator_assessments" ADD COLUMN "review_note" TEXT;
ALTER TABLE "innovation_indicator_assessments" ADD COLUMN "reviewed_by" UUID;
ALTER TABLE "innovation_indicator_assessments" ADD COLUMN "reviewed_at" TIMESTAMPTZ(3);

ALTER TABLE "innovation_indicator_assessments" ADD CONSTRAINT "innovation_indicator_assessments_reviewed_by_fkey"
  FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
