"use client";

import React from "react";
import { Users, Phone, ShieldCheck, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function TeamView() {
  const { availableUsers } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          টিম ও গাইড মেম্বার তালিকা (Team & Roles)
        </h2>
        <p className="text-xs text-slate-500">
          ট্যুর হোস্ট, ফটোগ্রাফার গাইড ও ম্যানেজমেন্ট স্টাফদের প্রোফাইল ও দায়িত্ব
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableUsers.map((u) => (
          <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              {u.avatar && u.avatar.startsWith("http") ? (
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-teal-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-800 text-teal-100 font-bold flex items-center justify-center shrink-0 text-sm">
                  {u.avatar || u.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                <div className="text-xs text-teal-700 font-semibold capitalize">
                  {u.role.replace("_", " ")}
                </div>
                <div className="text-[11px] text-slate-500">{u.title || "Rajshahi Tours Staff"}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{u.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
