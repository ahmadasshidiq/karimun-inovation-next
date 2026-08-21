"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebarLayout } from "@/components/app-sidebar";
import { toast } from "@/components/ui/toast";
import { parseApiError } from "@/lib/helper/response-api";

import DashboardContent from "./components/dashboard-content";
import {
  initialDashboardSummary,
  type AnnouncementItem,
  type CountdownValue,
  type DashboardApiData,
  type DashboardAssessmentItem,
  type DashboardMapPoint,
  type DashboardSummary,
} from "./page.config";

const calculateCountdown = (target: number, active: boolean): CountdownValue => {
  const difference = active ? Math.max(0, target - Date.now()) : 0;
  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference / 3_600_000) % 24);
  const minutes = Math.floor((difference / 60_000) % 60);
  const seconds = Math.floor((difference / 1_000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

export default function DashboardPage() {
  const [countdown, setCountdown] = useState<CountdownValue>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [summary, setSummary] = useState<DashboardSummary>(initialDashboardSummary);
  const [mapPoints, setMapPoints] = useState<DashboardMapPoint[]>([]);
  const [assessmentData, setAssessmentData] = useState<DashboardAssessmentItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [countdownTarget, setCountdownTarget] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [response, announcementResponse, configurationResponse] = await Promise.all([
        fetch("/api/innovations?page=1&limit=1", { cache: "no-store" }),
        fetch("/api/announcements?dashboard=true", { cache: "no-store" }),
        fetch("/api/dashboard-configuration", { cache: "no-store" }),
      ]);

      if (!response.ok) {
        throw new Error(
          await parseApiError(response, "Gagal mengambil data dashboard."),
        );
      }

      const result = (await response.json()) as Partial<DashboardApiData>;
      setSummary({ ...initialDashboardSummary, ...result.summary });
      setMapPoints(Array.isArray(result.mapData) ? result.mapData : []);
      setAssessmentData(
        Array.isArray(result.assessmentData) ? result.assessmentData : [],
      );
      if (announcementResponse.ok) {
        const announcementPayload = await announcementResponse.json();
        setAnnouncements(Array.isArray(announcementPayload.data) ? announcementPayload.data : []);
      }
      if (configurationResponse.ok) {
        const configurationPayload = await configurationResponse.json();
        const target = new Date(configurationPayload.data?.countdownTarget || "").getTime();
        setCountdownTarget(Number.isFinite(target) ? target : 0);
        setCountdownActive(Boolean(configurationPayload.data?.countdownActive));
      }
    } catch (error) {
      toast.add({
        title: "Gagal memuat dashboard",
        description:
          error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    }
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setCountdown(calculateCountdown(countdownTarget, countdownActive));
    });

    const interval = window.setInterval(() => {
      setCountdown(calculateCountdown(countdownTarget, countdownActive));
    }, 1_000);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(interval);
    };
  }, [countdownActive, countdownTarget]);

  useEffect(() => {
    // Fetch berjalan saat halaman dashboard dimuat.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <AppSidebarLayout>
      <DashboardContent
        countdown={countdown}
        summary={summary}
        mapPoints={mapPoints}
        assessmentData={assessmentData}
        announcements={announcements}
        countdownActive={countdownActive}
      />
    </AppSidebarLayout>
  );
}
