"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ExternalLink,
  MessageSquare,
  Download,
  ChevronDown,
  UserCheck,
  Sparkles,
  Bell,
} from "lucide-react";

interface HeaderProps {
  onOpenZipModal: () => void;
}

export function Header({ onOpenZipModal }: HeaderProps) {
  const { currentUser, switchUser, availableUsers, smsBalance } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      {/* Left Prototype Indicator matching Screenshot 4 */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Prototype • dummy data • today is 2 Oct 2026</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        
        {/* SMS Balance Pill matching Screenshot 4 */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>SMS balance ৳{smsBalance.toLocaleString("en-US")}</span>
        </div>

        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">View website</span>
        </Link>

        {/* Download Project ZIP button */}
        <button
          onClick={onOpenZipModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shadow-2xs"
          title="Download complete source code (.zip)"
        >
          <Download className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Download .ZIP</span>
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors text-left"
          >
            {currentUser.avatar && currentUser.avatar.startsWith("http") ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-teal-500"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-teal-800 text-teal-100 text-xs font-bold flex items-center justify-center shrink-0">
                {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden md:block leading-tight pr-1">
              <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-teal-700 font-semibold capitalize">
                {currentUser.role.replace("_", " ")}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Switcher Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Demo User / Role
              </div>
              <div className="max-h-64 overflow-y-auto p-1 space-y-1">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      u.id === currentUser.id
                        ? "bg-teal-50 text-teal-900 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                        {u.avatar && !u.avatar.startsWith("http") ? u.avatar : u.name[0]}
                      </div>
                      <div>
                        <div className="truncate max-w-[130px]">{u.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{u.role.replace("_", " ")}</div>
                      </div>
                    </div>
                    {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="pt-2 px-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <Link href="/login" className="text-rose-600 hover:underline">
                  Sign out
                </Link>
                <span className="text-[10px] text-slate-400">1-click switch</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
