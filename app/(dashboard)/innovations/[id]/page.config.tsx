"use client";

import {
  initialInnovationEditorValues,
  type InnovationEditorValues,
} from "../page.config";

export type InnovationDetailValues = InnovationEditorValues;

export const getInitialDetail = (id: string): InnovationDetailValues => ({
  ...initialInnovationEditorValues,
  id,
});
