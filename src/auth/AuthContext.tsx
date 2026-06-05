import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => void;
  signup: (credentials: SignUpCredentials) => void;
  logout: () => void;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends AuthCredentials {
  name: string;
}

const AUTH_STORAGE_KEY = "pulse-auth-user";

const AuthContext = createContext<AuthState | undefined>(undefined);

function readStoredUser() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function makeDisplayName(email: string) {
  const prefix = email.split("@")[0] ?? "creator";
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: ({ email, password }) => {
        const safeEmail = email.trim().toLowerCase();
        const safePassword = password.trim();

        if (!safeEmail || !safePassword) {
          throw new Error("Email and password are required.");
        }

        setUser({
          name: makeDisplayName(safeEmail),
          email: safeEmail,
        });
      },
      signup: ({ name, email, password }) => {
        const safeName = name.trim();
        const safeEmail = email.trim().toLowerCase();
        const safePassword = password.trim();

        if (!safeName || !safeEmail || !safePassword) {
          throw new Error("Name, email, and password are required.");
        }

        setUser({
          name: safeName,
          email: safeEmail,
        });
      },
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
