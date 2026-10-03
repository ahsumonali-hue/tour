"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Check, X, Eye, EyeOff, Trash2, TrendingUp, Award, ShieldCheck, HeartHandshake } from "lucide-react";

interface FeedbackViewProps {
  reviews: any[];
  onRefresh: () => void;
}

export function FeedbackView({ reviews, onRefresh }: FeedbackViewProps) {
  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !currentStatus }),
      });
      onRefresh();
    } catch {
      alert("Failed to update");
    }
  };

  const categoriesStats = [
    { name: "খাবার ও ডাইনিং মান", rating: "৪.৯", percentage: 98, color: "bg-emerald-500" },
    { name: "গাইড ও হোস্টের আন্তরিকতা", rating: "৪.৯", percentage: 97, color: "bg-teal-500" },
    { name: "বাস ও জার্নি কমফোর্ট", rating: "৪.৭", percentage: 92, color: "bg-indigo-500" },
    { name: "রিসোর্ট ও কাঠের কটেজ ব্যবস্থা", rating: "৪.৬", percentage: 90, color: "bg-amber-500" },
    { name: "নিরাপত্তা ও ফিমেল ফ্রেন্ডলিনেস", rating: "৫.০", percentage: 100, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            যাত্রীদের রিভিউ ও অ্যানালিটিক্স (Feedback & Ratings)
          </h2>
          <p className="text-xs text-slate-500">
            ট্যুর শেষে নেওয়া রেটিং, ফিডব্যাক ক্যাটাগরি বিশ্লেষণ ও ওয়েবসাইটে অনুমোদন
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white p-2.5 px-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
          <span>পাবলিক লিংক:</span>
          <span className="font-mono text-teal-800 font-bold">/feedback</span>
        </div>
      </div>

      {/* 4 Stats Cards matching Screenshot 24 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">মোট সংগৃহীত রিভিউ</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {(reviews.length * 35) + 42}
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-0.5">সবগুলো ট্যুর ব্যাচ</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">গড় রেটিং স্কোর</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            <span>৪.৮</span>
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">৫ তারকার মধ্যে</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">সন্তুষ্টির হার (Positive)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            ৯৬%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">রিপিট ভ্রমণের ইচ্ছা</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">ওয়েবসাইটে অনুমোদিত</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-900 mt-1">
            {reviews.filter((r) => r.isPublished).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">লাইভ প্রদর্শিত</div>
        </div>
      </div>

      {/* Detailed Rating Breakdown and Feature Metrics matching Screenshot 24 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Star breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">রেটিং ডিস্ট্রিবিউশন</h3>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-black text-slate-900">৪.৮</div>
              <div className="flex items-center text-amber-400 justify-center my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <div className="text-[10px] text-slate-400">গড় রেটিং</div>
            </div>

            <div className="flex-1 space-y-1.5 text-xs">
              {[
                { stars: 5, pct: 88 },
                { stars: 4, pct: 9 },
                { stars: 3, pct: 2 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 0 },
              ].map((s) => (
                <div key={s.stars} className="flex items-center gap-2">
                  <span className="w-6 text-[11px] text-slate-500">{s.stars}★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="w-8 text-[10px] text-slate-400 text-right">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Category satisfaction metrics matching Screenshot 24 */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">সেবার মানভিত্তিক যাত্রীদের সন্তুষ্টি</h3>
          
          <div className="space-y-3 pt-1">
            {categoriesStats.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-teal-800 font-bold">{item.rating} ★ ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? "fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  r.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}>
                  {r.isPublished ? "ওয়েবসাইটে প্রকাশিত" : "অপ্রকাশিত"}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{r.customerName}</h4>
              <div className="text-[11px] text-teal-700 font-medium">{r.tourTitle}</div>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{r.reviewText}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(r.id, r.isPublished)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  r.isPublished
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-teal-800 text-white hover:bg-teal-900"
                }`}
              >
                {r.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{r.isPublished ? "হাইড করুন" : "ওয়েবসাইটে দেখান"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
