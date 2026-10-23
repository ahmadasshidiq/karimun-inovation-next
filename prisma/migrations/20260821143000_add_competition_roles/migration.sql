-- Register the competition roles in the existing role table.
UPDATE "roles"
SET "permission" = '{"all":true}'::jsonb
WHERE lower("name") = lower('Super Admin');

INSERT INTO "roles" ("id", "name", "permission")
SELECT gen_random_uuid(), 'Admin OPD', '[
  {"model":"dashboard","actions":["view"]},
  {"model":"innovations","actions":["get-all","get-by-id","create","update"]},
  {"model":"innovation-competitions","actions":["get-all","get-by-id","register","update","delete","submit","view-results"]},
  {"model":"innovation-documents","actions":["get-all","get-by-id","upload","download","delete"]}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE lower("name") = lower('Admin OPD'));

INSERT INTO "roles" ("id", "name", "permission")
SELECT gen_random_uuid(), 'Juri / Tim Penilai', '[
  {"model":"dashboard","actions":["view"]},
  {"model":"innovation-competitions","actions":["get-all","get-by-id","assess","view-results"]},
  {"model":"innovation-documents","actions":["get-all","get-by-id","download"]}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE lower("name") = lower('Juri / Tim Penilai'));
