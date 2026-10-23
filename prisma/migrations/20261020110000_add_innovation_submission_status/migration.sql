ALTER TABLE "innovations" ADD COLUMN "submission_status" VARCHAR(20) NOT NULL DEFAULT 'INCOMPLETE';

CREATE INDEX "innovations_submission_status_idx" ON "innovations"("submission_status");
