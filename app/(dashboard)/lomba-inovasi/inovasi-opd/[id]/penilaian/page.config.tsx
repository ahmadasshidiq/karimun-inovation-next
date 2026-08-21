"use client";
export type AssessmentIndicator = { id: string; name: string; description: string | null; weight: string; minScore: number; maxScore: number };
export type ScoreInput = { indicatorId: string; score: number; notes: string };

