"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  LayoutDashboard,
  Map,
  Inbox,
  Users,
  MessageSquare,
  Star,
  DollarSign,
  Utensils,
  BookOpen,
  Globe,
  ShieldAlert,
  Download,
  PhoneCall,
  LogOut,
  ChevronRight,
} from "lucide-react";

export type DashboardTab =
  | "overview"
  | "tours"
  | "inquiries"
  | "customers"
  | "sms"
  | "feedback"
  | "accounting"
  | "meal_menus"
  | "network_contacts"
  | "website_content"
  | "team"
  | "audit_log";

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  inquiriesCount?: number;
  onOpenZipModal: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  inquiriesCount = 6,
  onOpenZipModal,
}: SidebarProps) {
  const { currentUser, switchUser } = useAuth();

  const operationsMenu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "tours", label: "Tours", icon: Map },
    { id: "inquiries", label: "Inquiries", icon: Inbox, badge: inquiriesCount },
    { id: "customers", label: "Customers", icon: Users },
    { id: "sms", label: "SMS Panel", icon: MessageSquare },
    { id: "feedback", label: "Feedback", icon: Star },
  ];

  const financeMenu = [
    { id: "accounting", label: "Accounting", icon: DollarSign },
  ];

  const setupMenu = [
    { id: "meal_menus", label: "Meal Menus", icon: Utensils },
    { id: "network_contacts", label: "Network Contacts", icon: PhoneCall },
    { id: "website_content", label: "Website Content", icon: Globe },
    { id: "team", label: "Team & Roles", icon: Users },
    { id: "audit_log", label: "Audit Log", icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-[#0a2321] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-[#133c39] select-none">
      {/* Top Brand Header */}
      <div className="p-4 border-b border-[#133c39] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/40">
            <Compass className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              Rajshahi Tours
            </div>
            <div className="text-[10px] text-teal-400 font-medium">
              & Travels • {currentUser.role.replace("_", " ").toUpperCase()}
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        
        {/* OPERATIONS GROUP */}
        <div>
          <div className="px-3 text-[10px] font-bold text-teal-500/80 uppercase tracking-wider mb-2">
            Operations
          </div>
          <div className="space-y-1">
            {operationsMenu.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as DashboardTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-teal-700/80 text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-[#113532] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-teal-400/80"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[#0a2321] text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FINANCE GROUP */}
        <div>
          <div className="px-3 text-[10px] font-bold text-teal-500/80 uppercase tracking-wider mb-2">
            Finance
          </div>
          <div className="space-y-1">
            {financeMenu.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as DashboardTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-teal-700/80 text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-[#113532] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-teal-400/80"}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SETUP GROUP */}
        <div>
          <div className="px-3 text-[10px] font-bold text-teal-500/80 uppercase tracking-wider mb-2">
            Setup
          </div>
          <div className="space-y-1">
            {setupMenu.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as DashboardTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-teal-700/80 text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-[#113532] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-teal-400/80"}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Sticky Action Area */}
      <div className="p-3 border-t border-[#133c39] space-y-2 bg-[#081d1c]">
        {/* Full Project ZIP Download Button */}
        <button
          onClick={onOpenZipModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Download Project .ZIP</span>
        </button>

        {/* Current User Quick View */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {currentUser.avatar && currentUser.avatar.startsWith("http") ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-teal-400"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-teal-800 text-teal-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-white font-semibold truncate leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-teal-400 capitalize">
                {currentUser.role.replace("_", " ")}
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
            title="Switch User / Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
