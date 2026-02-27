import type { Metadata } from "next";
import React from "react";
import Login from "../components/Login";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your MicroCBM account",
};

export default function page() {
  return <Login />;
}
