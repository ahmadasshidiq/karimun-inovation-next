CREATE TABLE "innovation_indices" (
  "id" UUID NOT NULL,
  "year" INTEGER NOT NULL,
  "score" DECIMAL(6,2) NOT NULL,
  "predicate" VARCHAR(50),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "innovation_indices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "innovation_indices_year_key" ON "innovation_indices"("year");
