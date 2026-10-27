-- This migration only changes the news and news_categories database objects.

-- CreateTable
CREATE TABLE "news_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_categories_slug_key" ON "news_categories"("slug");

-- CreateIndex
CREATE INDEX "news_categories_is_active_idx" ON "news_categories"("is_active");

-- AlterTable: keep the legacy enum column "category" intact.
ALTER TABLE "news" ADD COLUMN "category_id" UUID;

-- Seed the three legacy categories with stable identifiers.
INSERT INTO "news_categories" ("id", "name", "slug", "is_active", "updated_at") VALUES
  ('b3dd5d0f-92d0-4b8e-8f78-6be3fe729001', 'Sosialisasi', 'sosialisasi', true, CURRENT_TIMESTAMP),
  ('b3dd5d0f-92d0-4b8e-8f78-6be3fe729002', 'Bimbingan Teknis', 'bimbingan-teknis', true, CURRENT_TIMESTAMP),
  ('b3dd5d0f-92d0-4b8e-8f78-6be3fe729003', 'Diseminasi', 'diseminasi', true, CURRENT_TIMESTAMP);

-- Backfill every existing news record using its unchanged legacy enum value.
UPDATE "news" AS n
SET "category_id" = c."id"
FROM "news_categories" AS c
WHERE (n."category" = 'SOSIALISASI' AND c."slug" = 'sosialisasi')
   OR (n."category" = 'BIMBINGAN_TEKNIS' AND c."slug" = 'bimbingan-teknis')
   OR (n."category" = 'DISEMINASI' AND c."slug" = 'diseminasi');

-- Fail safely if a pre-existing news record could not be mapped.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "news" WHERE "category_id" IS NULL) THEN
    RAISE EXCEPTION 'News category backfill failed: one or more news records have no category_id.';
  END IF;
END $$;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "news_categories"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "news_category_id_idx" ON "news"("category_id");
