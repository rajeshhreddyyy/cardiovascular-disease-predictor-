import React, { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/client";

type SessionUser = {
  id: number;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
};

const SESSION_KEY = "heart_app_session";
const TOKEN_KEY = "heart_app_token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function writeSession(user: SessionUser | null) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function writeToken(token: string | null) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession());
  const [token, setToken] = useState<string | null>(() => readToken());

  async function login(email: string, password: string): Promise<void> {
    const res = await loginUser(email.trim(), password);
    const sessionUser = { id: res.user.id, name: res.user.name, email: res.user.email };
    setUser(sessionUser);
    setToken(res.token);
    writeSession(sessionUser);
    writeToken(res.token);
  }

  async function register(fullName: string, email: string, password: string): Promise<void> {
    await registerUser(fullName.trim(), email.trim(), password);
    await login(email.trim(), password);
  }

  function logout() {
    setUser(null);
    setToken(null);
    writeSession(null);
    writeToken(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      token
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider.");
  return ctx;
}

