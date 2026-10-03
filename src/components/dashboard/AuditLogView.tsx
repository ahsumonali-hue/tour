"use client";

import React from "react";
import { ShieldAlert, Clock, User, CheckCircle2 } from "lucide-react";

export function AuditLogView() {
  const logs = [
    {
      id: 1,
      user: "Rakibul Islam (Guide)",
      action: "SMS Broadcast Sent",
      details: "Sent 'Lunch is ready' notification to 11 confirmed booking holders.",
      time: "2 Oct 2026, 9:08 AM",
    },
    {
      id: 2,
      user: "Tanvir Ahmed (Admin)",
      action: "New Booking Created",
      details: "Booking RTT-2610-011 for Tania Talukder confirmed (5 persons). Advance: ৳7,500.",
      time: "1 Oct 2026, 4:33 PM",
    },
    {
      id: 3,
      user: "Safayat Hossain (Owner)",
      action: "Tour Budget Updated",
      details: "Updated Sajek October batch budget: Break-even set to 26 persons.",
      time: "1 Oct 2026, 2:15 PM",
    },
    {
      id: 4,
      user: "Nusrat Jahan (Staff)",
      action: "Lead Follow-up Note",
      details: "Added follow-up note for Nadia Rahman: 'কল দিয়েছি, বিকাশ নম্বর পাঠিয়েছি'.",
      time: "30 Sep 2026, 2:17 PM",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          অডিট লগ ও সিস্টেম অ্যাক্টিভিটি (Audit Log)
        </h2>
        <p className="text-xs text-slate-500">
          কোন স্টাফ সদস্য কখন কোন বুকিং পরিবর্তন করেছেন বা এসএমএস পাঠিয়েছেন তার পূর্ণাঙ্গ ইতিহাস
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700">
          সাম্প্রতিক সিস্টেম কার্যক্রম
        </div>
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.user}</span>
                  <span className="bg-teal-50 text-teal-800 text-[10px] px-2 py-0.2 rounded-full font-bold">
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-600">{log.details}</p>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
