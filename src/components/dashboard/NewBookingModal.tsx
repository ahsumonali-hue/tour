"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Search,
  CheckCircle,
  Plus,
  Calendar,
  Users,
  DollarSign,
  Phone,
  Sparkles,
} from "lucide-react";

interface NewBookingModalProps {
  tours: any[];
  customers: any[];
  preselectedTour?: any;
  preselectedInquiry?: any;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export function NewBookingModal({
  tours,
  customers,
  preselectedTour,
  preselectedInquiry,
  onClose,
  onBookingSuccess,
}: NewBookingModalProps) {
  const [selectedTourId, setSelectedTourId] = useState<string>(
    preselectedTour?.id || preselectedInquiry?.tourId || tours[0]?.id || "t-sajek-oct"
  );
  const [custPhone, setCustPhone] = useState(preselectedInquiry?.phone || "");
  const [custName, setCustName] = useState(preselectedInquiry?.customerName || "");
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);
  const [personsCount, setPersonsCount] = useState(preselectedInquiry?.personsCount || 1);
  const [seatNumbers, setSeatNumbers] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paidAdvance, setPaidAdvance] = useState("2000");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [bookingSource, setBookingSource] = useState(preselectedInquiry?.source || "Phone Call");
  const [sendConfirmationSms, setSendConfirmationSms] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone auto suggestions matching transcript
  const [showPhoneSuggestions, setShowPhoneSuggestions] = useState(false);
  const matchingCustomers = customers.filter(
    (c) =>
      custPhone.trim().length >= 2 &&
      (c.phone.includes(custPhone.trim()) || c.name.toLowerCase().includes(custPhone.toLowerCase()))
  );

  const currentTour = tours.find((t) => t.id === selectedTourId) || tours[0];
  const packages = currentTour?.packages && currentTour.packages.length > 0 ? currentTour.packages : [
    { id: 1, name: "স্ট্যান্ডার্ড ৪ জন শেয়ারিং", pricePerPerson: currentTour?.basePrice || 4800 },
    { id: 2, name: "কাপল এসি প্যাকেজ", pricePerPerson: 7500 },
  ];

  const currentPkg = packages[selectedPkgIndex] || packages[0];
  const unitPrice = currentPkg?.pricePerPerson || currentTour?.basePrice || 4800;
  const baseTotal = unitPrice * personsCount;
  const discountVal = Number(discount) || 0;
  const totalBill = Math.max(0, baseTotal - discountVal);
  const paidVal = Number(paidAdvance) || 0;
  const dueAmount = Math.max(0, totalBill - paidVal);

  const handleSelectCustomerSuggestion = (c: any) => {
    setCustName(c.name);
    setCustPhone(c.phone);
    setShowPhoneSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) {
      alert("নাম ও মোবাইল নম্বর আবশ্যক");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: selectedTourId,
          tourTitle: currentTour?.title,
          customerName: custName,
          customerPhone: custPhone,
          packageId: currentPkg?.id,
          packageName: currentPkg?.name,
          personsCount,
          seatNumbers: seatNumbers || "A1",
          baseAmount: baseTotal,
          discountAmount: discountVal,
          totalAmount: totalBill,
          paidAmount: paidVal,
          dueAmount: dueAmount,
          paymentMethod,
          bookingSource,
          sendSms: sendConfirmationSms,
          notes,
        }),
      });

      if (res.ok) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        onBookingSuccess();
        onClose();
      } else {
        alert("বুকিং সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch {
      alert("ত্রুটি হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-5 border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-700" />
              <span>নতুন কাস্টমার বুকিং এন্ট্রি</span>
            </h3>
            <p className="text-xs text-slate-500">
              ফোনে বা হোয়াটসঅ্যাপে পাওয়া বুকিং দ্রুত সিস্টেমে যুক্ত করুন
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Select Tour */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ট্যুর নির্বাচন করুন</label>
            <select
              value={selectedTourId}
              onChange={(e) => setSelectedTourId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
            >
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.batchName}) — ৳{t.basePrice}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Phone with Instant Auto-Suggestion matching transcript */}
          <div className="relative">
            <label className="block font-semibold text-slate-700 mb-1">
              কাস্টমার ফোন নম্বর <span className="text-teal-700">(টাইপ করলেই পূর্বের কাস্টমার সাজেশন আসবে)</span>
            </label>
            <input
              type="text"
              required
              value={custPhone}
              onChange={(e) => {
                setCustPhone(e.target.value);
                setShowPhoneSuggestions(true);
              }}
              onFocus={() => setShowPhoneSuggestions(true)}
              placeholder="017XX-XXXXXX বা 757950"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
            />

            {/* Suggestions list */}
            {showPhoneSuggestions && matchingCustomers.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 max-h-40 overflow-y-auto p-1.5 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase">
                  পূর্ববর্তী কাস্টমার সাজেশন:
                </div>
                {matchingCustomers.map((mc) => (
                  <div
                    key={mc.id}
                    onClick={() => handleSelectCustomerSuggestion(mc)}
                    className="p-2 rounded-xl hover:bg-teal-50 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{mc.name}</span>
                      <span className="text-slate-500 ml-2 font-mono">{mc.phone}</span>
                    </div>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                      {mc.district}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">কাস্টমারের নাম</label>
            <input
              type="text"
              required
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              placeholder="নাম লিখুন"
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          {/* Package and Persons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">প্যাকেজ</label>
              <select
                value={selectedPkgIndex}
                onChange={(e) => setSelectedPkgIndex(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {packages.map((pkg: any, idx: number) => (
                  <option key={idx} value={idx}>
                    {pkg.name} — ৳{pkg.pricePerPerson}/জন
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">যাত্রী সংখ্যা</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={personsCount}
                  onChange={(e) => setPersonsCount(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">জন</span>
              </div>
            </div>
          </div>

          {/* Seat Numbers and Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">সিট নম্বর (Seat No.)</label>
              <input
                type="text"
                value={seatNumbers}
                onChange={(e) => setSeatNumbers(e.target.value)}
                placeholder="যেমন: A1, A2 বা C3"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ডিসকাউন্ট বা ছাড় (৳)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Payment & Source matching transcript */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">অগ্রিম জমা (Advance)</label>
              <input
                type="number"
                value={paidAdvance}
                onChange={(e) => setPaidAdvance(e.target.value)}
                placeholder="2000"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="bKash">bKash (বিকাশ)</option>
                <option value="Nagad">Nagad (নগদ)</option>
                <option value="Rocket">Rocket (রকেট)</option>
                <option value="Cash">Cash (ক্যাশ)</option>
                <option value="Bank">Bank (ব্যাংক)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বুকিং সোর্স</label>
              <select
                value={bookingSource}
                onChange={(e) => setBookingSource(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Phone Call">Phone Call (ফোন কল)</option>
                <option value="WhatsApp">WhatsApp (হোয়াটসঅ্যাপ)</option>
                <option value="Facebook">Facebook (ফেসবুক)</option>
                <option value="Website">Website (ওয়েবসাইট)</option>
              </select>
            </div>
          </div>

          {/* Total Calculation Strip matching transcript */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300">সর্বমোট প্রদেয় বিল:</div>
              <div className="text-xl font-black text-amber-400">
                ৳{totalBill.toLocaleString("en-US")}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-300">বাকি বকেয়া (Due):</div>
              <div className="text-xl font-black text-rose-400">
                ৳{dueAmount.toLocaleString("en-US")}
              </div>
            </div>
          </div>

          {/* Send SMS Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={sendConfirmationSms}
              onChange={(e) => setSendConfirmationSms(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span>কাস্টমারকে তাৎক্ষণিক বুকিং নিশ্চিতকরণ এসএমএস পাঠান</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "সংরক্ষণ হচ্ছে..." : "বুকিং নিশ্চিত করুন (Save booking)"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
