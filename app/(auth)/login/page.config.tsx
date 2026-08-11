"use client";

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const initialLoginForm: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

