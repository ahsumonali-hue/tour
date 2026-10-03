"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "owner" | "admin" | "tour_guide" | "accountant" | "staff";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  title?: string;
  status: string;
}

interface AuthContextType {
  currentUser: User;
  switchUser: (role: UserRole | string) => void;
  setCurrentUser: (user: User) => void;
  smsBalance: number;
  deductSmsBalance: (amount: number) => void;
  setSmsBalance: (amount: number) => void;
  availableUsers: User[];
  isDemoMode: boolean;
}

const DEFAULT_USERS: User[] = [
  {
    id: "usr-owner",
    name: "Md Safayat Hossain",
    phone: "01782-250709",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Owner",
    status: "active",
  },
  {
    id: "usr-admin",
    name: "Tanvir Ahmed",
    phone: "01782-250710",
    role: "admin",
    avatar: "TA",
    title: "Admin",
    status: "active",
  },
  {
    id: "usr-guide-1",
    name: "Rakibul Islam",
    phone: "01834-551207",
    role: "tour_guide",
    avatar: "RI",
    title: "Tour Guide",
    status: "active",
  },
  {
    id: "usr-guide-2",
    name: "Sabbir Hossain",
    phone: "01717-388880",
    role: "tour_guide",
    avatar: "SH",
    title: "Tour Guide",
    status: "active",
  },
  {
    id: "usr-staff",
    name: "Nusrat Jahan",
    phone: "01728-538286",
    role: "staff",
    avatar: "NJ",
    title: "Staff",
    status: "active",
  },
  {
    id: "usr-acc",
    name: "Mahmudul Hasan",
    phone: "01750-644338",
    role: "accountant",
    avatar: "MH",
    title: "Accountant",
    status: "active",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0]);
  const [availableUsers, setAvailableUsers] = useState<User[]>(DEFAULT_USERS);
  const [smsBalance, setSmsBalanceState] = useState<number>(1843);
  const [isDemoMode] = useState<boolean>(true);

  useEffect(() => {
    // Fetch users from API if available
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.users && data.users.length > 0) {
          setAvailableUsers(data.users);
          const savedUserId = typeof window !== "undefined" ? localStorage.getItem("rtt_user_id") : null;
          if (savedUserId) {
            const match = data.users.find((u: User) => u.id === savedUserId);
            if (match) setCurrentUser(match);
          }
        }
      })
      .catch(() => {});

    // Fetch SMS balance
    fetch("/api/sms")
      .then((res) => res.json())
      .then((data) => {
        if (data.balance !== undefined) {
          setSmsBalanceState(data.balance);
        }
      })
      .catch(() => {});
  }, []);

  const switchUser = (roleOrId: string) => {
    const match = availableUsers.find((u) => u.id === roleOrId || u.role === roleOrId) || availableUsers[0];
    setCurrentUser(match);
    if (typeof window !== "undefined") {
      localStorage.setItem("rtt_user_id", match.id);
    }
  };

  const deductSmsBalance = (amount: number) => {
    setSmsBalanceState((prev) => Math.max(0, prev - amount));
  };

  const setSmsBalance = (amount: number) => {
    setSmsBalanceState(amount);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        setCurrentUser,
        smsBalance,
        deductSmsBalance,
        setSmsBalance,
        availableUsers,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
