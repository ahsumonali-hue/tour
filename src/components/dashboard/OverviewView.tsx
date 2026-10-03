"use client";

import React from "react";
import {
  Map,
  Users,
  DollarSign,
  Inbox,
  MessageSquare,
  Plus,
  Send,
  Calendar,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

interface OverviewViewProps {
  tours: any[];
  inquiries: any[];
  bookings: any[];
  customersCount: number;
  onNavigateTab: (tab: any) => void;
  onOpenNewTour: () => void;
  onOpenNewBooking: () => void;
  onSelectTourForSms: (tour: any) => void;
}

export function OverviewView({
  tours,
  inquiries,
  bookings,
  customersCount,
  onNavigateTab,
  onOpenNewTour,
  onOpenNewBooking,
  onSelectTourForSms,
}: OverviewViewProps) {
  const activeTours = tours.filter((t) => t.status === "running" || t.status === "published");
  const runningTour = tours.find((t) => t.status === "running") || tours[0];

  const totalCollected = bookings.reduce((sum, b) => sum + (b.paidAmount ?? b.paid_amount ?? 0), 0);
  const totalReceivable = bookings.reduce((sum, b) => sum + (b.totalAmount ?? b.total_amount ?? 0), 0);
  const totalDue = bookings.reduce((sum, b) => sum + (b.dueAmount ?? b.due_amount ?? 0), 0);
  const newInquiries = inquiries.filter((i) => i.status === "new");

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Headline */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>রাজশাহী ট্যুরস এন্ড ট্রাভেলস কন্ট্রোল সেন্টার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            আসসালামু আলাইকুম, স্বাগতম ড্যাশবোর্ডে!
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/80">
            ট্যুর ম্যানেজমেন্ট, ইন-ট্যুর এসএমএস ব্রডকাস্ট, লিড পাইপলাইন ও স্বয়ংক্রিয় হিসাব-নিকাশ এক জায়গায়।
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="relative z-10 flex flex-wrap gap-2.5">
          <button
            onClick={onOpenNewTour}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-xs text-white shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ট্যুর যোগ করুন</span>
          </button>

          <button
            onClick={onOpenNewBooking}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 border border-teal-600 font-semibold text-xs text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বুকিং এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Active Tours */}
        <div
          onClick={() => onNavigateTab("tours")}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">চলমান ও আসন্ন ট্যুর</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Map className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeTours.length}
          </div>
          <div className="mt-1 text-[11px] text-teal-700 font-medium flex items-center gap-1">
            <span>{tours.filter((t) => t.status === "running").length}টি লাইভ চলমান</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Confirmed Bookings */}
        <div
          onClick={() => onNavigateTab("tours")}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">মোট বুকিং কনফার্ম</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {bookings.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            {bookings.reduce((sum, b) => sum + (b.personsCount || 1), 0)} জন ভ্রমণকারী
          </div>
        </div>

        {/* Card 3: Total Collections */}
        <div
          onClick={() => onNavigateTab("accounting")}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">জমা কালেকশন</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-black text-amber-600 truncate">
            ৳{totalCollected.toLocaleString("en-US")}
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-medium">
            বকেয়া: ৳{totalDue.toLocaleString("en-US")}
          </div>
        </div>

        {/* Card 4: New Leads / Inquiries */}
        <div
          onClick={() => onNavigateTab("inquiries")}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">নতুন ইনকোয়ারি লিড</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-purple-900">
            {newInquiries.length}
          </div>
          <div className="mt-1 text-[11px] text-purple-700 font-medium flex items-center gap-1">
            <span>{inquiries.length}টি মোট লিড পাইপলাইনে</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

      </div>

      {/* Live In-Tour Broadcast Highlight Card (Focus of the Prototype) */}
      {runningTour && (
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-500/30 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  লাইভ চলমান ট্যুর
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {runningTour.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {runningTour.batchName} • গাইড: রাকিবুল ইসলাম (01834-551207)
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectTourForSms(runningTour)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-950 text-white font-bold text-xs shadow-sm transition-all hover:scale-102"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>১-ক্লিকে ইন-ট্যুর SMS ব্রডকাস্ট পাঠান</span>
            </button>
          </div>

          {/* Quick Preset Buttons preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onSelectTourForSms(runningTour)}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors"
            >
              <div className="text-xs font-bold text-amber-900">🍛 দুপুরের খাবার রেডি</div>
              <div className="text-[10px] text-amber-700 mt-0.5">ডাইনিং কল • ১১ জনকে পাঠান</div>
            </button>

            <button
              onClick={() => onSelectTourForSms(runningTour)}
              className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-left transition-colors"
            >
              <div className="text-xs font-bold text-teal-900">⏰ বিকাল ৪টায় ঘুরতে বের হওয়া</div>
              <div className="text-[10px] text-teal-700 mt-0.5">সাইটসিয়িং জমায়েত</div>
            </button>

            <button
              onClick={() => onSelectTourForSms(runningTour)}
              className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left transition-colors"
            >
              <div className="text-xs font-bold text-indigo-900">🚌 বাস ছাড়ছে ১৫ মিনিটে</div>
              <div className="text-[10px] text-indigo-700 mt-0.5">ডিপার্চার অ্যালার্ট</div>
            </button>

            <button
              onClick={() => onSelectTourForSms(runningTour)}
              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition-colors"
            >
              <div className="text-xs font-bold text-rose-900">💸 বকেয়া পরিশোধের অনুরোধ</div>
              <div className="text-[10px] text-rose-700 mt-0.5">বকেয়া সম্পন্নকারীদের ফিল্টার</div>
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Bookings */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-700" />
              <span>সাম্প্রতিক বুকিং তালিকা</span>
            </h3>
            <button
              onClick={() => onNavigateTab("tours")}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              সবগুলো দেখুন →
            </button>
          </div>

          <div className="space-y-2">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {b.customerName}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md">
                      {b.bookingCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {b.packageName} • {b.personsCount} জন • সিট: {b.seatNumbers || "Pending"}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">
                    ৳{((b.totalAmount ?? b.total_amount ?? 0)).toLocaleString("en-US")}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    জমা: ৳{b.paidAmount ?? b.paid_amount ?? 0} {(b.dueAmount ?? b.due_amount ?? 0) > 0 && <span className="text-rose-600">(বকেয়া ৳{b.dueAmount ?? b.due_amount ?? 0})</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: New Leads & Follow-ups */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-purple-700" />
              <span>নতুন কাস্টমার লিড ও ইনকোয়ারি</span>
            </h3>
            <button
              onClick={() => onNavigateTab("inquiries")}
              className="text-xs font-semibold text-purple-700 hover:underline"
            >
              কানবান বোর্ড →
            </button>
          </div>

          <div className="space-y-2.5">
            {inquiries.slice(0, 4).map((iq) => (
              <div
                key={iq.id}
                onClick={() => onNavigateTab("inquiries")}
                className="p-3 rounded-2xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{iq.customerName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    iq.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : iq.status === "contacted"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {iq.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-medium truncate">
                  {iq.tourTitle} ({iq.personsCount} জন)
                </div>
                {iq.message && (
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    "{iq.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
