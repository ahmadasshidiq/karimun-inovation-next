"use client";

import { useEffect, useState } from "react";

import { AppSidebarLayout } from "@/components/app-sidebar";

import DashboardContent from "./components/dashboard-content";
import type { CountdownValue } from "./page.config";

const countdownTarget = new Date("2026-08-27T00:00:00+07:00").getTime();

const calculateCountdown = (): CountdownValue => {
  const difference = Math.max(0, countdownTarget - Date.now());
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

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setCountdown(calculateCountdown());
    });

    const interval = window.setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1_000);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <AppSidebarLayout>
      <DashboardContent countdown={countdown} />
    </AppSidebarLayout>
  );
}
