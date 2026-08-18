"use client";

export type DashboardConfigurationDto = {
  id?: string;
  countdownTarget: string;
  countdownActive: boolean;
};

export type DashboardConfigurationResponse = {
  data?: DashboardConfigurationDto | null;
};

export const initialConfiguration: DashboardConfigurationDto = {
  countdownTarget: "",
  countdownActive: true,
};
