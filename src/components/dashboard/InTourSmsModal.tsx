"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  MessageSquare,
  Search,
  Check,
  CheckCheck,
  Smartphone,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface BookingRecipient {
  id: number;
  customerName: string;
  customerPhone: string;
  bookingCode: string;
  personsCount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

interface InTourSmsModalProps {
  tour: any;
  bookings: BookingRecipient[];
  onClose: () => void;
  onSmsSentSuccess?: () => void;
}

export function InTourSmsModal({
  tour,
  bookings = [],
  onClose,
  onSmsSentSuccess,
}: InTourSmsModalProps) {
  const { currentUser, deductSmsBalance } = useAuth();

  const [filterMode, setFilterMode] = useState<"all" | "due" | "pending">("all");
  const [selectedTemplate, setSelectedTemplate] = useState("lunch");
  const [templateTitle, setTemplateTitle] = useState("দুপুরের খাবার রেডি");
  const [messageText, setMessageText] = useState(
    "দুপুরের খাবার রেডি — সবাই ডাইনিং-এ চলে আসুন। ২০ মিনিটের মধ্যে খাবার পরিবেশন শুরু হবে। — Rajshahi Tours"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhones, setSelectedPhones] = useState<string[]>(
    bookings.map((b) => b.customerPhone)
  );
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Filtered booking recipients
  const filteredBookings = bookings.filter((b) => {
    if (filterMode === "due") return b.dueAmount > 0;
    return true;
  }).filter((b) => {
    if (!searchQuery) return true;
    return (
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const toggleSelectPhone = (phone: string) => {
    setSelectedPhones((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };

  const selectAll = () => {
    setSelectedPhones(filteredBookings.map((b) => b.customerPhone));
  };

  const deselectAll = () => {
    setSelectedPhones([]);
  };

  // Templates presets
  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val);
    if (val === "lunch") {
      setTemplateTitle("দুপুরের খাবার রেডি");
      setMessageText("দুপুরের খাবার রেডি — সবাই ডাইনিং-এ চলে আসুন। ২০ মিনিটের মধ্যে খাবার পরিবেশন শুরু হবে। — Rajshahi Tours");
    } else if (val === "sightseeing") {
      setTemplateTitle("বিকাল ৪টায় ঘুরতে বের হওয়া");
      setMessageText("বিকাল ৪টায় সবাই রিসোর্টের সামনে থাকবেন, আমরা সূর্যাস্ত দেখতে রওনা হবো। ক্যামেরা সাথে রাখুন। — Rajshahi Tours");
    } else if (val === "bus_alert") {
      setTemplateTitle("বাস ছাড়ছে ১৫ মিনিটের মধ্যে");
      setMessageText("জরুরি বার্তা: আর ১৫ মিনিটের মধ্যে বাস ছাড়বে। সবাই দ্রুত বাসে আপনার সিটে এসে বসুন। — Rajshahi Tours");
    } else if (val === "due_reminder") {
      setTemplateTitle("বকেয়া পরিশোধের অনুরোধ");
      setMessageText("প্রিয় {name}, আপনার ট্যুরের অবশিষ্ট বকেয়া ৳{due} বাসে ওঠার পূর্বে পরিশোধ করতে অনুরোধ করা হচ্ছে। ধন্যবাদ — Rajshahi Tours");
    } else if (val === "feedback") {
      setTemplateTitle("ট্যুর ফিডব্যাক লিংক");
      setMessageText("প্রিয় {name}, আশা করি আপনার ট্যুর দারুণ কেটেছে! কেমন ছিল আপনার অভিজ্ঞতা? মতামত জানাতে ভিজিট করুন: {link} — Rajshahi Tours");
    } else {
      setTemplateTitle("কাস্টম মেসেজ");
      setMessageText("");
    }
  };

  const insertVariable = (variableStr: string) => {
    setMessageText((prev) => prev + ` ${variableStr} `);
  };

  // Unicode char calculator
  const charCount = messageText.length;
  const isBangla = /[\u0980-\u09FF]/.test(messageText);
  const charsPerPart = isBangla ? 70 : 160;
  const smsParts = Math.max(1, Math.ceil(charCount / charsPerPart));
  const ratePerSms = isBangla ? 0.45 : 0.35;
  const totalCost = Number((selectedPhones.length * smsParts * ratePerSms).toFixed(2));

  // Preview replacement text
  const previewText = messageText
    .replace(/{name}/g, "তানভীর হোসেন")
    .replace(/{tour}/g, tour.title || "সাজেক ট্যুর")
    .replace(/{due}/g, "১,৬০০")
    .replace(/{link}/g, "rajshahitours.com/feedback");

  const handleSend = async () => {
    if (selectedPhones.length === 0) {
      alert("অনুগ্রহ করে অন্তত একজন প্রাপক নির্বাচন করুন");
      return;
    }
    if (!messageText.trim()) {
      alert("মেসেজ ফাঁকা রাখা যাবে না");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          senderName: `${currentUser.name} (${currentUser.role === "tour_guide" ? "Guide" : "Admin"})`,
          smsType: filterMode === "due" ? "due_reminder" : "tour_broadcast",
          templateTitle,
          message: messageText,
          recipients: selectedPhones,
          costPerSms: ratePerSms * smsParts,
        }),
      });

      if (res.ok) {
        deductSmsBalance(selectedPhones.length * smsParts);
        setSentSuccess(true);
        if (onSmsSentSuccess) onSmsSentSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        alert("এসএমএস পাঠানো ব্যর্থ হয়েছে");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Top Header matching Screenshot 5 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {templateTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {tour.title} • {filterMode === "all" ? "All confirmed" : "Filter active"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Form & Right Live Phone Preview matching Screenshot 5 */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Inputs & Recipients) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Filter Target Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  filterMode === "all"
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All confirmed ({bookings.length} holders)
              </button>
              <button
                onClick={() => setFilterMode("due")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  filterMode === "due"
                    ? "bg-rose-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Only with due ({bookings.filter((b) => b.dueAmount > 0).length})
              </button>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
              >
                <option value="lunch">🍛 দুপুরের খাবার রেডি (Lunch call)</option>
                <option value="sightseeing">⏰ বিকাল ৪টায় ঘুরতে বের হওয়া (Sightseeing meet)</option>
                <option value="bus_alert">🚌 বাস ছাড়ছে ১৫ মিনিটের মধ্যে (Departure alert)</option>
                <option value="due_reminder">💸 বকেয়া পরিশোধের অনুরোধ (Due reminder)</option>
                <option value="feedback">⭐ ট্যুর ফিডব্যাক লিংক (Review link)</option>
                <option value="custom">— Write a custom message —</option>
              </select>
            </div>

            {/* Message Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Message</label>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  <span>{charCount} chars • {smsParts} SMS</span>
                  <span className="bg-teal-50 text-teal-800 px-2 py-0.2 rounded-full font-bold">
                    Bangla / Unicode
                  </span>
                </div>
              </div>

              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="এখানে মেসেজ লিখুন..."
                className="w-full p-3 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-teal-600 bg-white"
              />

              {/* Variable Chips matching Screenshot 5 */}
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-400 font-semibold">Insert:</span>
                {[
                  "{name}",
                  "{tour}",
                  "{date}",
                  "{time}",
                  "{persons}",
                  "{total}",
                  "{paid}",
                  "{due}",
                  "{code}",
                  "{link}",
                ].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="text-[10px] bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 px-2 py-0.5 rounded-lg border border-slate-200 transition-colors font-mono"
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Bangla SMS use Unicode: 70 characters for 1 SMS. 67 per part after that. Rate ৳0.45/SMS.
              </p>
            </div>

            {/* Recipient Checkbox List matching Screenshot 5 */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Recipients ({selectedPhones.length}/{filteredBookings.length})
                  </span>
                  <button
                    onClick={selectAll}
                    className="text-[11px] text-teal-700 hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-[11px] text-slate-400 hover:underline"
                  >
                    Deselect All
                  </button>
                </div>

                <div className="relative w-44">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name/phone..."
                    className="w-full pl-8 pr-2 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1.5 p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
                {filteredBookings.map((b) => {
                  const isChecked = selectedPhones.includes(b.customerPhone);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleSelectPhone(b.customerPhone)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-white border border-teal-300 shadow-2xs"
                          : "hover:bg-slate-100/80 border border-transparent opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-teal-600 pointer-events-none"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {b.customerName}{" "}
                            <span className="font-normal text-slate-500">• {b.customerPhone}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {b.bookingCode} • {b.personsCount} জন {b.dueAmount > 0 && <span className="text-rose-600 font-bold">• due ৳{b.dueAmount}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Mobile Mockup matching Screenshot 5 */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Live mobile preview
            </div>

            {/* iPhone Mockup Frame */}
            <div className="w-[270px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 text-slate-900 relative">
              {/* Top notch */}
              <div className="w-24 h-4 bg-slate-950 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              {/* Screen Area */}
              <div className="bg-slate-100 rounded-[30px] p-3 min-h-[380px] flex flex-col justify-between overflow-hidden">
                {/* Mobile Top Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-200 pb-2">
                  <div className="font-bold text-slate-700">11:30 AM</div>
                  <div className="flex items-center gap-1 font-semibold text-[9px]">
                    <span>4G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Sender Avatar & Header */}
                <div className="text-center py-2 border-b border-slate-200/60">
                  <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1 shadow-xs">
                    RT
                  </div>
                  <div className="text-xs font-bold text-slate-900">RajshahiTT</div>
                  <div className="text-[9px] text-slate-400">to Md. Tareq • 01436-944116</div>
                </div>

                {/* Message Bubble */}
                <div className="flex-1 py-3 flex flex-col justify-center space-y-1">
                  <div className="text-[9px] text-center text-slate-400">Text Message • Today 11:30 AM</div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                    {previewText || "এখানে মেসেজের লাইভ প্রিভিউ দেখতে পাবেন..."}
                  </div>
                </div>

                {/* Mobile Bottom Footer */}
                <div className="text-center pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                  {charCount} chars • {smsParts} SMS • bal ৳1,843
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Fixed Bar matching Screenshot 5 */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <span>👥 {selectedPhones.length} recipients</span>
            <span>💬 {selectedPhones.length * smsParts} SMS</span>
            <span className="text-amber-600 font-bold">৳{totalCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || selectedPhones.length === 0}
              className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Sending..." : "Review & send"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
