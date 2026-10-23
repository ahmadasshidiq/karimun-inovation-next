ALTER TABLE "innovations" ADD COLUMN "approval_status" VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW';
ALTER TABLE "innovations" ADD COLUMN "approval_note" TEXT;
ALTER TABLE "innovations" ADD COLUMN "approved_by" UUID;
ALTER TABLE "innovations" ADD COLUMN "approved_at" TIMESTAMPTZ(3);

CREATE INDEX "innovations_approval_status_idx" ON "innovations"("approval_status");
ALTER TABLE "innovations" ADD CONSTRAINT "innovations_approved_by_fkey"
  FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
