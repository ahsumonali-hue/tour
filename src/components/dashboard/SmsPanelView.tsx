"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Search, Users, Tag, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SmsPanelViewProps {
  logs: any[];
  customers: any[];
  onRefresh: () => void;
}

export function SmsPanelView({ logs, customers, onRefresh }: SmsPanelViewProps) {
  const { smsBalance, deductSmsBalance } = useAuth();
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [campaignTitle, setCampaignTitle] = useState("অফার ও প্রমোশন এসএমএস");
  const [messageText, setMessageText] = useState(
    "রাজশাহী ট্যুরস এন্ড ট্রাভেলস: আসন্ন সাজেক ও সিলেট ট্যুরে বুকিং চলছে! দ্রুত সিট বুকিং করে ৫০০ টাকা ছাড় পান। যোগাযোগ: 01782-250709"
  );
  const [isSending, setIsSending] = useState(false);

  const getTargetRecipients = () => {
    if (recipientFilter === "loyal") return customers.filter((c) => c.tags?.includes("Loyal"));
    if (recipientFilter === "due") return customers.filter((c) => (c.currentDue || 0) > 0);
    if (recipientFilter === "repeat") return customers.filter((c) => c.tags?.includes("Repeat"));
    return customers;
  };

  const targetList = getTargetRecipients();
  const targetPhones = targetList.map((c) => c.phone);

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPhones.length === 0) {
      alert("কোন প্রাপক পাওয়া যায়নি");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: "Marketing Team",
          smsType: "marketing",
          templateTitle: campaignTitle,
          message: messageText,
          recipients: targetPhones,
          costPerSms: 0.45,
        }),
      });

      if (res.ok) {
        deductSmsBalance(targetPhones.length);
        alert(`সফলভাবে ${targetPhones.length} জন কাস্টমারকে ক্যাম্পেইন এসএমএস পাঠানো হয়েছে!`);
        onRefresh();
      }
    } catch {
      alert("এসএমএস পাঠানো ব্যর্থ হয়েছে");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            এসএমএস প্যানেল (SMS Marketing & Campaigns)
          </h2>
          <p className="text-xs text-slate-500">
            লয়াল ও নিয়মিত ভ্রমণকারীদের একসাথে প্রমোশনাল অফার, ছাড় ও ট্যুর আপডেট পাঠান
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>বর্তমান ব্যালেন্স: ৳{smsBalance.toLocaleString("en-US")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campaign Sender Box */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            নতুন ক্যাম্পেইন মেসেজ পাঠান
          </h3>

          <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">প্রাপক ফিল্টার করুন:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "all", label: "সব কাস্টমার", count: customers.length },
                  { id: "loyal", label: "লয়াল কাস্টমার", count: customers.filter((c) => c.tags?.includes("Loyal")).length },
                  { id: "repeat", label: "রিপিট ট্রাভেলার", count: customers.filter((c) => c.tags?.includes("Repeat")).length },
                  { id: "due", label: "যাদের বকেয়া আছে", count: customers.filter((c) => (c.currentDue || 0) > 0).length },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setRecipientFilter(item.id)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      recipientFilter === item.id
                        ? "bg-teal-900 text-white border-teal-900 font-bold"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] opacity-80">{item.count} জন</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ক্যাম্পেইনের শিরোনাম</label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">মেসেজের মূল টেক্সট</label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                মোট প্রাপক: <b>{targetPhones.length} জন</b> (আনুমানিক খরচ: ৳{(targetPhones.length * 0.45).toFixed(2)})
              </span>

              <button
                type="submit"
                disabled={isSending || targetPhones.length === 0}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? "পাঠানো হচ্ছে..." : "এসএমএস ব্রডকাস্ট করুন"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Logs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            সাম্প্রতিক এসএমএস হিস্ট্রি
          </h3>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-900">{log.templateTitle}</span>
                  <span className="text-emerald-700 font-semibold">{log.deliveryStatus || "Delivered"}</span>
                </div>
                <p className="text-slate-600 line-clamp-2">{log.message}</p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>প্রাপক: {log.recipientCount} জন</span>
                  <span>খরচ: ৳{log.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
