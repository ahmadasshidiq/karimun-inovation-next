CREATE TABLE "innovations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "status" "status" NOT NULL DEFAULT 'active',
    "initiator_type" VARCHAR(100),
    "initiator_name" VARCHAR(255),
    "type" VARCHAR(100),
    "classification" VARCHAR(100),
    "innovation_form" VARCHAR(100),
    "thematic" VARCHAR(255),
    "pkpn_cluster" VARCHAR(255),
    "pkpn_sub_cluster" VARCHAR(255),
    "government_affairs" VARCHAR(255),
    "trial_period" DATE,
    "implementation_period" DATE,
    "is_development" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "purpose" TEXT,
    "files" JSONB NOT NULL DEFAULT '[]',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "innovations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "innovations_created_by_idx" ON "innovations"("created_by");
CREATE INDEX "innovations_status_idx" ON "innovations"("status");
CREATE INDEX "innovations_type_idx" ON "innovations"("type");
CREATE INDEX "innovations_classification_idx" ON "innovations"("classification");
CREATE INDEX "innovations_deleted_at_idx" ON "innovations"("deleted_at");

ALTER TABLE "innovations"
ADD CONSTRAINT "innovations_created_by_fkey"
FOREIGN KEY ("created_by") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
