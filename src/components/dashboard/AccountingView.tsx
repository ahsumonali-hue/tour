"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  Plus,
  ArrowRight,
  PieChart,
  CheckCircle,
  Printer,
} from "lucide-react";

interface AccountingViewProps {
  entries: any[];
  summary: any;
  comparison: any;
  onRefresh: () => void;
}

export function AccountingView({
  entries,
  summary,
  comparison,
  onRefresh,
}: AccountingViewProps) {
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [showAddEntry, setShowAddEntry] = useState(false);

  // Form states
  const [category, setCategory] = useState("bus");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [entryType, setEntryType] = useState("tour_expense");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displaySummary = summary || {
    tourRevenues: 172000,
    totalTourCost: 99000,
    totalOverhead: 10000,
    totalMarketing: 4500,
    grossProfit: 73000,
    netProfit: 63500,
    breakdown: {
      busCost: 45000,
      hotelCost: 28000,
      foodCost: 33000,
      guideCost: 6000,
      boatCost: 15000,
      officeRent: 7000,
      wifiBill: 3000,
      marketing: 4500,
    },
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/accounting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthYear: selectedMonth,
          category,
          amount: Number(amount),
          description: desc,
          entryType,
        }),
      });
      if (res.ok) {
        setShowAddEntry(false);
        setAmount("");
        setDesc("");
        onRefresh();
      }
    } catch {
      alert("Error adding entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header matching video transcript */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            হিসাব ও আর্থিক প্রতিবেদন (Accounting & P&L)
          </h2>
          <p className="text-xs text-slate-500">
            ট্যুরভিত্তিক মোট কালেকশন, পরিবহন-হোটেল-খাবার খরচ, গ্রস প্রফিট ও নিট মুনাফা বিশ্লেষণ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 shadow-2xs"
          >
            <option value="2026-10">অক্টোবর ২০২৬ (বর্তমান মাস)</option>
            <option value="2026-09">সেপ্টেম্বর ২০২৬ (গত মাস)</option>
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট / ডাউনলোড রশিদ</span>
          </button>

          <button
            onClick={() => setShowAddEntry(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>খরচ এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Main Income & Profit Summary Cards matching video */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Tour Income */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">ট্যুর প্ল্যানিং মোট আয় (Income)</div>
          <div className="text-3xl font-black text-slate-900">
            ৳{displaySummary.tourRevenues.toLocaleString("en-US")}
          </div>
          <div className="text-xs text-emerald-600 font-medium">
            ভ্রমণকারীদের মোট প্রাপ্তি ও বুকিং ফি
          </div>
        </div>

        {/* Card 2: Gross Profit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">ট্যুর খরচ বাদে গ্রস প্রফিট (Gross Profit)</div>
          <div className="text-3xl font-black text-amber-600">
            ৳{displaySummary.grossProfit.toLocaleString("en-US")}
          </div>
          <div className="text-xs text-slate-500">
            বাস, হোটেল, খাবার ও গাইড বিল কাটার পর
          </div>
        </div>

        {/* Card 3: Net Profit In Hand */}
        <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white p-6 rounded-3xl shadow-lg space-y-2">
          <div className="text-xs font-bold text-amber-300">অফিস খরচ বাদে চূড়ান্ত নিট প্রফিট (Net In Hand)</div>
          <div className="text-3xl font-black text-white">
            ৳{displaySummary.netProfit.toLocaleString("en-US")}
          </div>
          <div className="text-xs text-teal-200">
            অফিস ভাড়া ৳৭,০০০ ও ওয়াইফাই বিল কাটার পর
          </div>
        </div>

      </div>

      {/* Itemized Cost Breakdown Sheet matching transcript */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-700" />
          <span>ট্যুর খরচের বিস্তারিত বিবরণ (Itemized Expenses)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">বাস ও পরিবহন বিল</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳৪৫,০০০</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">হোটেল ও রিসোর্ট বিল</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳২৮,০০০</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">খাবার ও বিরিয়ানি বিল</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳৩৩,০০০</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">ট্যুর গাইড অনারারিয়াম</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳৬,০০০</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">চাঁদের গাড়ি ও বোট বিল</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳১৫,০০০</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">অফিস ভাড়া ও ওয়াইফাই</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳১০,০০০</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">ফেসবুক মার্কেটিং বিজ্ঞাপন</div>
            <div className="text-lg font-bold text-slate-900 mt-1">৳৪,৫০০</div>
          </div>
        </div>
      </div>

      {/* Month Comparison (September vs October) */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-700" />
          <span>গত মাসের সাথে তুলনা (Month Comparison)</span>
        </h3>
        <p className="text-xs text-slate-600">
          সেপ্টেম্বর মাসে ৩টি ট্যুর থেকে মোট কালেকশন ছিল ৳২,৮৫,০০০ এবং নিট প্রফিট ছিল ৳৮১,০০০। চলতি অক্টোবর মাসে ১টি ট্যুর রানিং রয়েছে।
        </p>
      </div>

      {/* Add Expense Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">খরচ বা আয়ের এন্ট্রি</h3>
              <button onClick={() => setShowAddEntry(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">এন্ট্রি টাইপ</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="tour_expense">ট্যুর খরচ (Tour Expense)</option>
                  <option value="overhead_expense">অফিস ওভারহেড খরচ (Office Expense)</option>
                  <option value="marketing_expense">মার্কেটিং খরচ (Marketing)</option>
                  <option value="income">ট্যুর আয় (Income)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="bus">বাস ভাড়া (Bus)</option>
                  <option value="hotel">হোটেল / রিসোর্ট (Hotel)</option>
                  <option value="food">খাবার বিল (Food)</option>
                  <option value="guide">গাইড অনারারিয়াম (Guide)</option>
                  <option value="boat">বোট / চান্দের গাড়ি (Boat)</option>
                  <option value="office_rent">অফিস ভাড়া (Office Rent)</option>
                  <option value="wifi">ওয়াইফাই / ইউটিলিটি</option>
                  <option value="marketing">ফেসবুক বিজ্ঞাপন</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="যেমন: ৫০০০"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">বিবরণ (Description)</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="যেমন: সাজেক চাঁদের গাড়ি অগ্রিম ভাড়া"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-teal-900 text-white rounded-xl font-bold text-xs"
              >
                {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "এন্ট্রি সংরক্ষণ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
