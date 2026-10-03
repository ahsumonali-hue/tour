"use client";

import React, { useState } from "react";
import { Globe, Save, CheckCircle } from "lucide-react";

export function WebsiteContentView() {
  const [headline, setHeadline] = useState("রাজশাহী থেকে সারা বাংলাদেশ");
  const [subheadline, setSubheadline] = useState(
    "সাজেকের মেঘ, সিলেটের চা-বাগান, সেন্টমার্টিনের নীল পানি — নিরাপদ, সাশ্রয়ী আর গোছানো গ্রুপ ট্যুর। আপনি শুধু ব্যাগ গুছিয়ে ভদ্রা মোড়ে চলে আসুন।"
  );
  const [banner, setBanner] = useState(
    "📢 অক্টোবর ব্যাচ: সাজেক ১৬ অক্টোবর ও সিলেট ৩০ অক্টোবর — বুকিং চলছে! পুরনো কাস্টমারদের জন্য ৩০০ টাকা ছাড়!"
  );
  const [phone, setPhone] = useState("01782-250709");
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_headline: headline,
          hero_subheadline: subheadline,
          top_banner_text: banner,
          contact_phone: phone,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Error saving settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ওয়েবসাইট কনটেন্ট কন্ট্রোল (Website Content)
          </h2>
          <p className="text-xs text-slate-500">
            ল্যান্ডিং পেজের শিরোনাম, সাব-শিরোনাম, টপ অ্যানাউন্সমেন্ট ব্যানার ও হটলাইন নম্বর পরিবর্তন করুন
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs max-w-3xl space-y-4">
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>ওয়েবসাইটের তথ্য সফলভাবে আপডেট হয়েছে!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              হিরো সেকশনের মূল শিরোনাম (Headline)
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              সাব-শিরোনাম (Subtitle)
            </label>
            <textarea
              rows={3}
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              টপ অ্যানাউন্সমেন্ট ব্যানার টেক্সট
            </label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              হটলাইন নম্বর
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>সংরক্ষণ করুন (Save section)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
