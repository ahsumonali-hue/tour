"use client";

import React, { useState } from "react";
import {
  Inbox,
  Phone,
  MessageSquare,
  Plus,
  CheckCircle,
  X,
  Search,
  ArrowRight,
  UserCheck,
  Send,
  Calendar,
  Sparkles,
} from "lucide-react";

interface InquiryItem {
  id: number;
  inquiryCode: string;
  customerName: string;
  phone: string;
  tourId?: string;
  tourTitle: string;
  personsCount: number;
  preferredPackage?: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "not_interested";
  assignedTo?: string;
  source?: string;
  followUps?: Array<{
    id: string;
    note: string;
    author: string;
    date: string;
  }>;
  createdAt?: string;
}

interface InquiriesViewProps {
  inquiries: InquiryItem[];
  onRefresh: () => void;
  onConvertToBooking: (inquiry: InquiryItem) => void;
}

export function InquiriesView({
  inquiries,
  onRefresh,
  onConvertToBooking,
}: InquiriesViewProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(
    inquiries.find((i) => i.inquiryCode === "iq-10") || inquiries[0] || null
  );
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [search, setSearch] = useState("");

  const newCol = inquiries.filter((i) => i.status === "new");
  const contactedCol = inquiries.filter((i) => i.status === "contacted");
  const convertedCol = inquiries.filter((i) => i.status === "converted");
  const notInterestedCol = inquiries.filter((i) => i.status === "not_interested");

  const handleStatusChange = async (inquiryId: number, newStatus: string) => {
    try {
      await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      }
      onRefresh();
    } catch {
      alert("Status update failed");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newNote: newNoteText,
          author: "Tanvir Ahmed",
        }),
      });
      const data = await res.json();
      if (res.ok && data.followUps) {
        setSelectedInquiry({ ...selectedInquiry, followUps: data.followUps });
        setNewNoteText("");
        onRefresh();
      }
    } catch {
      alert("Note add failed");
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ইনকোয়ারি ও লিড পাইপলাইন (Inquiries Kanban)
          </h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইট ও সোশ্যাল মিডিয়া থেকে আসা কাস্টমার অনুসন্ধানের ফলো-আপ ও বুকিং রূপান্তর
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম বা ফোনে খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Kanban & Right Drawer Grid matching Screenshot 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kanban Board Columns (8 cols on large screens) */}
        <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* COLUMN 1: NEW */}
          <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>New</span>
                </span>
                <span className="text-[10px] text-slate-400">Not contacted yet</span>
              </div>
              <span className="text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                {newCol.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {newCol.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedInquiry(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    selectedInquiry?.id === item.id
                      ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                      : "bg-white hover:border-slate-300 border-slate-200 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.customerName}</span>
                    <span className="text-[10px] text-slate-400">just now</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.phone}</div>
                  
                  <div className="mt-2 text-xs font-medium text-slate-800 truncate">
                    {item.tourTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    👥 {item.personsCount} person • {item.preferredPackage || "Standard"}
                  </div>

                  {item.message && (
                    <p className="mt-1.5 text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 line-clamp-1 italic">
                      💬 "{item.message}"
                    </p>
                  )}

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-amber-600 font-semibold">Unassigned</span>
                    <span className="text-teal-700 font-bold hover:underline">ভিউ ডিটেইলস →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: CONTACTED */}
          <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Contacted</span>
                </span>
                <span className="text-[10px] text-slate-400">Called / messaged</span>
              </div>
              <span className="text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                {contactedCol.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {contactedCol.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedInquiry(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    selectedInquiry?.id === item.id
                      ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                      : "bg-white hover:border-slate-300 border-slate-200 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.customerName}</span>
                    <span className="text-[10px] text-slate-400">2d ago</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.phone}</div>
                  
                  <div className="mt-2 text-xs font-medium text-slate-800 truncate">
                    {item.tourTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    👥 {item.personsCount} persons • {item.preferredPackage}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                      👤 {item.assignedTo || "Tanvir"}
                    </span>
                    <span className="text-teal-700 font-bold hover:underline">ওপেন ড্রয়ার →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: CONVERTED */}
          <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Converted</span>
                </span>
                <span className="text-[10px] text-slate-400">Became a booking</span>
              </div>
              <span className="text-xs font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                {convertedCol.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {convertedCol.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedInquiry(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    selectedInquiry?.id === item.id
                      ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-white hover:border-slate-300 border-slate-200 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.customerName}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Converted</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.phone}</div>
                  
                  <div className="mt-2 text-xs font-medium text-slate-800 truncate">
                    {item.tourTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    👥 {item.personsCount} persons
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Detail Drawer matching Screenshot 6 */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5 sticky top-20">
          {selectedInquiry ? (
            <>
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedInquiry.customerName}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      selectedInquiry.status === "converted"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedInquiry.status === "contacted"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span className="capitalize">{selectedInquiry.status}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Website inquiry • 3d ago</span>
                  </div>
                </div>
              </div>

              {/* Call & WhatsApp Quick Buttons matching Screenshot 6 */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedInquiry.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reply via SMS</span>
                </a>
              </div>

              {/* Tour Details Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900">{selectedInquiry.tourTitle}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Starts 12 Nov 2026</span>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200/60 text-slate-600">
                  <div><b>Phone:</b> {selectedInquiry.phone}</div>
                  <div><b>Persons:</b> {selectedInquiry.personsCount}</div>
                  <div className="col-span-2"><b>Package:</b> {selectedInquiry.preferredPackage || "Standard"}</div>
                </div>
              </div>

              {/* Status Switcher matching Screenshot 6 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status:</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
                  {(["new", "contacted", "converted", "not_interested"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedInquiry.id, st)}
                      className={`p-2 rounded-xl text-left flex items-center gap-1.5 capitalize transition-all ${
                        selectedInquiry.status === st
                          ? "bg-slate-900 text-white shadow-xs font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        st === "new" ? "bg-blue-400" : st === "contacted" ? "bg-amber-400" : st === "converted" ? "bg-emerald-400" : "bg-rose-400"
                      }`} />
                      <span>{st.replace("_", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-ups Thread matching Screenshot 6 */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Follow-ups ({selectedInquiry.followUps?.length || 0})
                  </span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {(selectedInquiry.followUps || []).map((fu) => (
                    <div key={fu.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-bold text-teal-800">{fu.author}</span>
                        <span>{fu.date}</span>
                      </div>
                      <p className="text-slate-700 leading-snug">{fu.note}</p>
                    </div>
                  ))}
                </div>

                {/* Add new follow-up note input */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="কি কথা হলো? e.g. কল দিয়েছি, বিকাশ নম্বর পাঠিয়েছি..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-teal-600"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isAddingNote || !newNoteText.trim()}
                      className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                    >
                      {isAddingNote ? "Adding..." : "Add note"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Convert to booking action button matching Screenshot 6 */}
              <div className="pt-2">
                <button
                  onClick={() => onConvertToBooking(selectedInquiry)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Convert to booking (বুকিং এ রূপান্তর) →</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              বামে যে কোন একটি ইনকোয়ারি কার্ডে ক্লিক করুন
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
