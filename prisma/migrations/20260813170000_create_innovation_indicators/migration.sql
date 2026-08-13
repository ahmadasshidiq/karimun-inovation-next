CREATE TABLE "innovation_indicator_assessments" (
    "id" UUID NOT NULL,
    "innovation_id" UUID NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "parameter" TEXT NOT NULL,
    "score" DECIMAL(8,2) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "innovation_indicator_assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "innovation_indicator_documents" (
    "id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "document_number" VARCHAR(255),
    "document_date" DATE,
    "document_title" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "object_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "innovation_indicator_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "innovation_indicator_assessments_innovation_id_indicator_id_key"
ON "innovation_indicator_assessments"("innovation_id", "indicator_id");
CREATE INDEX "innovation_indicator_assessments_innovation_id_idx"
ON "innovation_indicator_assessments"("innovation_id");
CREATE INDEX "innovation_indicator_documents_assessment_id_idx"
ON "innovation_indicator_documents"("assessment_id");

ALTER TABLE "innovation_indicator_assessments"
ADD CONSTRAINT "innovation_indicator_assessments_innovation_id_fkey"
FOREIGN KEY ("innovation_id") REFERENCES "innovations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "innovation_indicator_documents"
ADD CONSTRAINT "innovation_indicator_documents_assessment_id_fkey"
FOREIGN KEY ("assessment_id") REFERENCES "innovation_indicator_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
