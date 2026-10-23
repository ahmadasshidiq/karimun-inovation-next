ALTER TABLE "innovations" ADD COLUMN "category" VARCHAR(100);

CREATE INDEX "innovations_category_idx" ON "innovations"("category");
