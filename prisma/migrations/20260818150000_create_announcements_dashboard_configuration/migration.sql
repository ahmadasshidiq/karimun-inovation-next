CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "announcement_date" DATE NOT NULL,
    "status" "status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dashboard_configurations" (
    "id" UUID NOT NULL,
    "countdown_target" TIMESTAMPTZ(3) NOT NULL,
    "countdown_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "dashboard_configurations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "announcements_status_idx" ON "announcements"("status");
CREATE INDEX "announcements_announcement_date_idx" ON "announcements"("announcement_date");
CREATE INDEX "announcements_deleted_at_idx" ON "announcements"("deleted_at");
