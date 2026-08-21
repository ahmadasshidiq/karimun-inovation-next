export type MasterPermission = {
  model: string;
  actions: string[];
};

export const MASTER_PERMISSIONS: MasterPermission[] = [
  {
    model: "dashboard",
    actions: ["view"],
  },
  {
    model: "users",
    actions: [
      "get-all",
      "get-by-id",
      "create",
      "update",
      "delete",
      "export",
      "import",
    ],
  },
  {
    model: "roles",
    actions: ["get-all", "get-by-id", "create", "update", "delete"],
  },
  {
    model: "institutions",
    actions: [
      "get-all",
      "get-by-id",
      "create",
      "update",
      "delete",
      "export",
      "import",
    ],
  },
  {
    model: "nomenclatures",
    actions: ["get-all", "get-by-id", "create", "update", "delete"],
  },
  {
    model: "innovations",
    actions: [
      "get-all",
      "get-by-id",
      "create",
      "update",
      "delete",
      "export",
      "import",
    ],
  },
  {
    model: "innovation-competitions",
    actions: [
      "get-all",
      "get-by-id",
      "register",
      "update",
      "delete",
      "submit",
      "verify",
      "manage-period",
      "manage-indicators",
      "manage-juries",
      "assess",
      "view-results",
      "finalize",
      "export",
    ],
  },
  {
    model: "training-reports",
    actions: ["get-all", "get-by-id", "create", "update", "delete"],
  },
  {
    model: "innovation-indicators",
    actions: ["get-all", "get-by-id", "update"],
  },
  {
    model: "innovation-documents",
    actions: ["get-all", "get-by-id", "upload", "download", "delete"],
  },
  {
    model: "announcements",
    actions: ["get-all", "get-by-id", "create", "update", "delete"],
  },
  {
    model: "dashboard-configurations",
    actions: ["get-by-id", "update"],
  },
];
