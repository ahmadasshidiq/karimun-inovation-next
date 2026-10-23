"use client";
export type InstitutionDetail = { id: string; name: string; type: string; address: string | null; status: string; nomenclature?: { id: string; name: string }; _count?: { users: number; childInstitutions: number } };
