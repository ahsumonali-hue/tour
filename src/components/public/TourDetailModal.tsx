"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Utensils,
  Bus,
  ShieldCheck,
  Phone,
  Sparkles,
  ChevronRight,
  Info,
  DollarSign,
} from "lucide-react";

interface TourDetailModalProps {
  tour: any;
  onClose: () => void;
}

export function TourDetailModal({ tour, onClose }: TourDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "food" | "pricing" | "book">("overview");

  // Booking Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [personsCount, setPersonsCount] = useState(1);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [pickupPoint, setPickupPoint] = useState("ভদ্রা মোড়, রাজশাহী");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successBookingCode, setSuccessBookingCode] = useState("");

  const packages = tour.packages && tour.packages.length > 0 ? tour.packages : [
    { name: "৪ জন ১ রুমে (নন-এসি কাঠের রিসোর্ট)", pricePerPerson: tour.basePrice || 4800, roomType: "4 in 1 Room" },
    { name: "কাপল প্যাকেজ - এসি কাঠের রিসোর্ট (২ জন)", pricePerPerson: 7500, roomType: "AC Couple" },
  ];

  const addons = tour.addons || [];

  const currentPkg = packages[selectedPkgIndex] || packages[0];
  const pkgPrice = currentPkg ? currentPkg.pricePerPerson : tour.basePrice;
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = addons.find((a: any) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalCalculated = (pkgPrice + addonsTotal) * personsCount;
  const advanceMin = Math.round(totalCalculated * 0.4);

  const toggleAddon = (id: number) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      alert("অনুগ্রহ করে আপনার নাম ও ফোন নম্বর লিখুন");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: guestName,
          phone: guestPhone,
          tourId: tour.id,
          tourTitle: tour.title,
          personsCount,
          preferredPackage: `${currentPkg.name} (৳${pkgPrice}/জন)`,
          message: `পিকআপ: ${pickupPoint}। অ্যাড-অনস: ${selectedAddons.length}টি। মন্তব্য: ${notes}`,
          source: "website_modal",
          status: "new",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setSuccessBookingCode(data.inquiry?.inquiryCode || "IQ-NEW");
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        alert(data.error || "কিছু সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন");
      }
    } catch (err) {
      alert("অনুরোধ ব্যর্থ হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="relative aspect-21/9 sm:aspect-24/8 bg-slate-900 overflow-hidden">
          <img
            src={tour.coverImage}
            alt={tour.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header texts */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/90 text-white text-xs font-bold px-3 py-0.5 rounded-full mb-1.5">
              <span>{tour.batchName || "আসন্ন ব্যাচ"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {tour.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{tour.startDate} হতে {tour.endDate}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{tour.durationNights} রাত {tour.durationDays} দিন</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{tour.departureFrom || "ভদ্রা মোড়, রাজশাহী"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "border-teal-700 text-teal-900 bg-white"
                : "border-transparent text-slate-600 hover:text-teal-800"
            }`}
          >
            সারসংক্ষেপ
          </button>
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "itinerary"
                ? "border-teal-700 text-teal-900 bg-white"
                : "border-transparent text-slate-600 hover:text-teal-800"
            }`}
          >
            দিনভিত্তিক ভ্রমণ প্ল্যান
          </button>
          <button
            onClick={() => setActiveTab("food")}
            className={`py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "food"
                ? "border-teal-700 text-teal-900 bg-white"
                : "border-transparent text-slate-600 hover:text-teal-800"
            }`}
          >
            খাবারের মেন্যু
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "pricing"
                ? "border-teal-700 text-teal-900 bg-white"
                : "border-transparent text-slate-600 hover:text-teal-800"
            }`}
          >
            প্যাকেজ ও খরচ
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={`py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "book"
                ? "border-amber-600 text-amber-700 bg-white font-bold"
                : "border-transparent text-amber-600 hover:text-amber-800"
            }`}
          >
            বুকিং ও অনুসন্ধান
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">ট্যুর বিবরণ</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{tour.description}</p>
              </div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5">প্রধান আকর্ষণ সমূহ:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tour.highlights.map((h: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100/60">
                        <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                    প্যাকেজে যা যা অন্তর্ভুক্ত:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(tour.inclusions || [
                      "রাজশাহী হতে রিটার্ন নন-এসি চেয়ার কোচ বাস",
                      "রিসোর্ট/হোটেল রাত্রিযাপন",
                      "নিয়মিত পুষ্টিকর খাবার",
                      "অভিজ্ঞ গাইড ও সার্বক্ষণিক তত্ত্বাবধান",
                    ]).map((inc: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">
                    প্যাকেজের বাইরে:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(tour.exclusions || ["হাইওয়ে বিরতির খাবার", "ব্যক্তিগত কেনাকাটা"]).map((exc: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-rose-600 font-bold">✗</span> {exc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bus & Transport Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">যানবাহন ও ট্রান্সপোর্ট</div>
                    <div className="text-xs text-slate-600">{tour.busType || "নন-এসি চেয়ার কোচ + চান্দের গাড়ি"}</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("book")}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  এখনই বুক করুন →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ITINERARY */}
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">দিনভিত্তিক ভ্রমণসূচী</h3>
              {(tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary : [
                {
                  day: 1,
                  title: "দিন ১: রাজশাহী হতে গন্তব্যে পৌঁছানো ও ভ্রমণ",
                  description: "সকালে নির্ধারিত স্পটে নেমে নাস্তা সেরে চেক-ইন। এরপর স্থানীয় আকর্ষণীয় স্থানগুলো ঘুরে দেখা ও স্থানীয় ঐতিহ্যবাহী খাবারে দুপুরের আহার।",
                  spots: ["প্রধান স্পট ১", "ভিউ পয়েন্ট", "সানসেট স্পট"],
                },
                {
                  day: 2,
                  title: "দিন ২: সাইটসিয়িং, ছবি তোলা ও রাজশাহীর উদ্দেশ্যে ফিরতি যাত্রা",
                  description: "ভোরে সূর্যোদয় দর্শন। নাস্তা সেরে অন্যান্য দর্শনীয় স্থান ভ্রমণ ও সন্ধ্যায় রাজশাহীর বাসে ওঠা।",
                  spots: ["সানরাইজ পয়েন্ট", "ঐতিহাসিক স্থান", "শপিং পয়েন্ট"],
                },
              ]).map((dayPlan: any, idx: number) => (
                <div key={idx} className="relative pl-6 pb-4 border-l-2 border-teal-500/40 last:border-none">
                  <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-xs" />
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">
                      Day {dayPlan.day || idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{dayPlan.title}</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{dayPlan.description}</p>
                    {dayPlan.spots && dayPlan.spots.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {dayPlan.spots.map((spot: string, sIdx: number) => (
                          <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            📍 {spot}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FOOD */}
          {activeTab === "food" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">পুষ্টিকর ও স্বাস্থ্যসম্মত খাবার তালিকা</h3>
                  <p className="text-xs text-slate-500">ট্যুরের প্রতিদিনের ৫ বেলা প্রধান খাবার ও স্ন্যাক্স মেন্যু</p>
                </div>
                <Utensils className="w-5 h-5 text-amber-500" />
              </div>

              {(tour.foodPlan && tour.foodPlan.length > 0 ? tour.foodPlan : [
                {
                  day: 1,
                  breakfast: "ডিম খিচুড়ি + বেগুন ভাজা + স্পেশাল চা",
                  lunch: "দেশি পাহাড়ি মুরগি ভুনা + ভর্তা + ডাল + সাদা ভাত",
                  snacks: "চা ও পাহাড়ি তাজা ফল",
                  dinner: "স্পেশাল ব্যাম্বু বিরিয়ানি / চিকেন বারবিকিউ",
                },
                {
                  day: 2,
                  breakfast: "ভূনা পরোটা + আলুর দম + ডিম পোচ + চা",
                  lunch: "লোকাল ঐতিহ্যবাহী মাছ / হাঁসের মাংস + ভাত",
                  snacks: "সন্ধ্যায় চা ও বিস্কুট",
                  dinner: "হাইওয়ে ডিনার ও রাজশাহীর উদ্দেশ্যে রওনা",
                },
              ]).map((fp: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-teal-900 border-b border-slate-200 pb-1">
                    দিন {fp.day || idx + 1} এর খাবারের আয়োজন:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {fp.breakfast && (
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-amber-700">🍳 সকালের নাস্তা:</span> {fp.breakfast}
                      </div>
                    )}
                    {fp.lunch && (
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-emerald-700">🍛 দুপুরের খাবার:</span> {fp.lunch}
                      </div>
                    )}
                    {fp.snacks && (
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-orange-700">☕ বিকালের নাস্তা:</span> {fp.snacks}
                      </div>
                    )}
                    {fp.dinner && (
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-purple-700">🍗 রাতের ডিনার:</span> {fp.dinner}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PRICING */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">উপলব্ধ প্যাকেজ ও রুমের ধরণ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedPkgIndex === idx
                        ? "border-teal-700 bg-teal-50/50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                      {pkg.isDefault && (
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                          জনপ্রিয়
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xl font-black text-amber-600">
                      ৳{pkg.pricePerPerson.toLocaleString("en-US")}
                      <span className="text-xs font-normal text-slate-500 ml-1">/জনপ্রতি</span>
                    </div>
                    {pkg.description && (
                      <p className="mt-1 text-xs text-slate-600">{pkg.description}</p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPkgIndex(idx);
                        setActiveTab("book");
                      }}
                      className="mt-3 w-full py-1.5 text-xs font-semibold rounded-lg bg-teal-800 text-white hover:bg-teal-900 transition-colors"
                    >
                      এই প্যাকেজে বুক করুন
                    </button>
                  </div>
                ))}
              </div>

              {/* Addons */}
              {addons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">ঐচ্ছিক অ্যাড-অনস:</h4>
                  <div className="flex flex-wrap gap-2">
                    {addons.map((ad: any) => (
                      <div
                        key={ad.id}
                        className="text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200"
                      >
                        {ad.name} — <span className="font-bold text-amber-600">+৳{ad.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BOOK / INQUIRY FORM */}
          {activeTab === "book" && (
            <div>
              {isSuccess ? (
                <div className="text-center py-8 space-y-3 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    ধন্যবাদ! আপনার বুকিং অনুরোধ গ্রহণ করা হয়েছে
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    আমাদের ট্যুর কো-অর্ডিনেটর খুব শীঘ্রই আপনার মোবাইল নম্বরে (<b>{guestPhone}</b>) কল করে বিস্তারিত জানাবেন ও সিট নিশ্চিত করবেন।
                  </p>
                  <div className="inline-block bg-white px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 border border-emerald-300">
                    ইনকোয়ারি কোড: {successBookingCode}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-teal-900 text-white text-xs font-bold rounded-xl"
                    >
                      ঠিক আছে
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">নির্বাচিত ট্যুর:</span> {tour.title}
                    </div>
                    <div className="font-bold text-amber-700">
                      সিট খালি: {tour.availableSeats}টি
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        আপনার পুরো নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="যেমন: তানভীর আহমেদ"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-teal-600 bg-white"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        মোবাইল নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="017XX-XXXXXX"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-teal-600 bg-white"
                      />
                    </div>
                  </div>

                  {/* Persons and Package selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ভ্রমণকারীর সংখ্যা (Persons)
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPersonsCount(Math.max(1, personsCount - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-slate-800">{personsCount} জন</span>
                        <button
                          type="button"
                          onClick={() => setPersonsCount(personsCount + 1)}
                          className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        প্যাকেজ নির্বাচন করুন
                      </label>
                      <select
                        value={selectedPkgIndex}
                        onChange={(e) => setSelectedPkgIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-teal-600 bg-white"
                      >
                        {packages.map((pkg: any, idx: number) => (
                          <option key={idx} value={idx}>
                            {pkg.name} — ৳{pkg.pricePerPerson}/জন
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Optional Addons */}
                  {addons.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        অতিরিক্ত টিকিট ও রাইড (Add-ons):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {addons.map((addon: any) => (
                          <label
                            key={addon.id}
                            className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs ${
                              selectedAddons.includes(addon.id)
                                ? "bg-teal-50 border-teal-500 text-teal-900"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedAddons.includes(addon.id)}
                                onChange={() => toggleAddon(addon.id)}
                                className="rounded text-teal-600"
                              />
                              <span>{addon.name}</span>
                            </span>
                            <span className="font-bold text-amber-600">+৳{addon.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pickup Point */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        রাজশাহীর পিকআপ পয়েন্ট
                      </label>
                      <select
                        value={pickupPoint}
                        onChange={(e) => setPickupPoint(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="ভদ্রা মোড়, রাজশাহী">ভদ্রা মোড় (বিকাশ অফিসের সামনে)</option>
                        <option value="রেলগেট, রাজশাহী">রেলগেট বাস স্টপ</option>
                        <option value="তালাইমারী মোড়">তালাইমারী মোড়</option>
                        <option value="নাটোর বাইপাস">নাটোর বাইপাস মোড়</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        কোন মন্তব্য বা বিশেষ চাওয়া (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="যেমন: ফ্রন্ট সিট লাগবে"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Total calculation strip */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-300">মোট আনুমানিক খরচ ({personsCount} জন):</div>
                      <div className="text-2xl font-black text-amber-400">
                        ৳{totalCalculated.toLocaleString("en-US")}
                      </div>
                      <div className="text-[11px] text-teal-300">
                        বুকিং কনফার্ম করতে অগ্রিম জমা মাত্র: ৳{advanceMin.toLocaleString("en-US")} (বিকাশ/নগদ/ক্যাশ)
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-white text-sm shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "পাঠানো হচ্ছে..." : "বুকিং নিশ্চিত করুন →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Fixed Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-700" />
            <span>সরাসরি কথা বলুন: <b>০১৭৮২-২৫০৭০৯</b></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
