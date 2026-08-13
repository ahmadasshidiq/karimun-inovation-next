-- CreateEnum
CREATE TYPE "status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "nip" VARCHAR(50),
    "phone" VARCHAR(30),
    "status" "status" NOT NULL DEFAULT 'active',
    "current_token" TEXT,
    "password" TEXT NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" UUID NOT NULL,
    "nomenklatur_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "status" "status" NOT NULL DEFAULT 'active',
    "parent_institution_id" UUID,
    "address" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nomenklatur" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nomenklatur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_nip_key" ON "users"("nip");

-- CreateIndex
CREATE INDEX "users_institution_id_idx" ON "users"("institution_id");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "institutions_nomenklatur_id_idx" ON "institutions"("nomenklatur_id");

-- CreateIndex
CREATE INDEX "institutions_parent_institution_id_idx" ON "institutions"("parent_institution_id");

-- CreateIndex
CREATE INDEX "institutions_status_idx" ON "institutions"("status");

-- CreateIndex
CREATE INDEX "institutions_deleted_at_idx" ON "institutions"("deleted_at");

-- CreateIndex
CREATE INDEX "nomenklatur_status_idx" ON "nomenklatur"("status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_nomenklatur_id_fkey" FOREIGN KEY ("nomenklatur_id") REFERENCES "nomenklatur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_parent_institution_id_fkey" FOREIGN KEY ("parent_institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
