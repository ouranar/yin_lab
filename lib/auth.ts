import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "lab_admin_session";

const getAdminPassword = () => {
  if (process.env.LAB_ADMIN_PASSWORD) {
    return process.env.LAB_ADMIN_PASSWORD;
  }

  if (process.env.NODE_ENV !== "production") {
    return "lab-admin";
  }

  return "";
};

const getSessionSecret = () => process.env.LAB_SESSION_SECRET ?? "lab-showcase-secret";

const getSessionValue = () =>
  crypto
    .createHash("sha256")
    .update(`${getSessionSecret()}:${getAdminPassword()}`)
    .digest("hex");

export const verifyAdminPassword = (password: string) => password === getAdminPassword();

export const isAdminConfigured = () => Boolean(getAdminPassword());

export const isAuthorizedRequest = (request: NextRequest) =>
  request.cookies.get(ADMIN_COOKIE_NAME)?.value === getSessionValue();

export const isAdminAuthenticated = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getSessionValue();
};

export const setAdminSession = async () => {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, getSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};

export const requireAdmin = async () => {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
};
