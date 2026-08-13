"use client";

export type LoginFormValues = {
  identifier: string;
  password: string;
  rememberMe: boolean;
};

export const initialLoginForm: LoginFormValues = {
  identifier: "",
  password: "",
  rememberMe: false,
};
