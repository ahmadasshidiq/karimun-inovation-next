ALTER TABLE "users" ADD COLUMN "email" VARCHAR(255);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
