"use client";

export {
  initialInnovationEditorValues as initialFormValues,
  type InnovationEditorValues as InnovationFormValues,
} from "../page.config";

export const selectOptions = {
  status: ["ACTIVE", "INACTIVE"],
  initiatorType: ["Perangkat Daerah", "ASN", "Masyarakat"],
  type: ["Digital", "Non Digital"],
  innovationForm: ["Digital", "Non Digital"],
};
