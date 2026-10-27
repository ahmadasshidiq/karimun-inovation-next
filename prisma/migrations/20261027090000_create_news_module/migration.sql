-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('BERITA', 'AGENDA');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('SOSIALISASI', 'BIMBINGAN_TEKNIS', 'DISEMINASI');

-- CreateTable
CREATE TABLE "news" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "cover_image" TEXT,
    "category" "NewsCategory" NOT NULL,
    "type" "NewsType" NOT NULL DEFAULT 'BERITA',
    "event_date" DATE,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMPTZ(3),
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE INDEX "news_status_published_at_idx" ON "news"("status", "published_at");

-- CreateIndex
CREATE INDEX "news_is_featured_published_at_idx" ON "news"("is_featured", "published_at");

-- CreateIndex
CREATE INDEX "news_author_id_idx" ON "news"("author_id");

-- CreateIndex
CREATE INDEX "news_deleted_at_idx" ON "news"("deleted_at");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey"
  FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
