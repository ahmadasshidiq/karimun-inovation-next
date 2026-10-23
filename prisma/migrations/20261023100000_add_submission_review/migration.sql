ALTER TABLE "innovation_submissions" ADD COLUMN "review_note" TEXT;
ALTER TABLE "innovation_submissions" ADD COLUMN "reviewed_by" UUID;
ALTER TABLE "innovation_submissions" ADD COLUMN "reviewed_at" TIMESTAMPTZ(3);

ALTER TABLE "innovation_submissions" ADD CONSTRAINT "innovation_submissions_reviewed_by_fkey"
  FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
