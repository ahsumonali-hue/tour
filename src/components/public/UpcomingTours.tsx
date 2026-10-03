"use client";

import React, { useState } from "react";
import { Calendar, Users, ArrowRight, Clock, MapPin, Tag, Sparkles } from "lucide-react";

interface TourItem {
  id: string;
  title: string;
  slug: string;
  destination: string;
  batchName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  durationNights: number;
  totalSeats: number;
  availableSeats: number;
  basePrice: number;
  coverImage: string;
  description: string;
  highlights?: string[];
  inclusions?: string[];
  foodPlan?: any[];
  itinerary?: any[];
  packages?: any[];
  addons?: any[];
  budgetData?: any;
}

interface UpcomingToursProps {
  tours: TourItem[];
  onSelectTour: (tour: TourItem) => void;
}

export function UpcomingTours({ tours, onSelectTour }: UpcomingToursProps) {
  const [filter, setFilter] = useState("all");

  const filterOptions = [
    { id: "all", label: "সবগুলো ট্যুর" },
    { id: "hills", label: "পাহাড়ি ট্রিপ (সাজেক/বান্দরবান)" },
    { id: "sea", label: "সমুদ্র ও নদী (সেন্টমার্টিন/সুন্দরবন)" },
    { id: "sylhet", label: "সিলেট ও ঝর্ণা" },
    { id: "day", label: "১ দিনের ডে ট্যুর" },
  ];

  const filteredTours = tours.filter((t) => {
    if (filter === "all") return true;
    if (filter === "hills") return t.destination.includes("সাজেক") || t.destination.includes("বান্দরবান");
    if (filter === "sea") return t.destination.includes("কক্সবাজার") || t.destination.includes("সুন্দরবন");
    if (filter === "sylhet") return t.destination.includes("সিলেট");
    if (filter === "day") return t.durationDays === 1 || t.title.includes("ডে লং");
    return true;
  });

  const getDayBadge = (startDateStr: string) => {
    try {
      const parts = startDateStr.split("-");
      if (parts.length >= 3) {
        return parts[2];
      }
      return "১৫";
    } catch {
      return "১৫";
    }
  };

  const getMonthNameBangla = (startDateStr: string) => {
    try {
      const parts = startDateStr.split("-");
      const month = Number(parts[1]);
      const months = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
      return months[month - 1] || "অক্টো";
    } catch {
      return "অক্টো";
    }
  };

  return (
    <section id="upcoming-tours" className="py-16 sm:py-24 bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              — বুকিং চলছে
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-teal-950 tracking-tight">
              আসন্ন ট্যুর সমূহ
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
              রাজশাহী থেকে সরাসরি আরামদায়ক চেয়ার কোচ বাসে রওনা। প্রতিটি ট্যুরে সীমিত সিট সংখ্যা।
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  filter === opt.id
                    ? "bg-teal-900 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Grid matching Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => {
            const dayNumber = getDayBadge(tour.startDate);
            const monthText = getMonthNameBangla(tour.startDate);

            return (
              <div
                key={tour.id}
                onClick={() => onSelectTour(tour)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-teal-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={tour.coverImage}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Left Top Date Tag matching Screenshot 3 */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-xl p-1.5 px-2.5 text-center shadow-md border border-slate-100 flex flex-col items-center leading-none">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{monthText}</span>
                    <span className="text-lg font-black text-slate-900 leading-tight">{dayNumber}</span>
                  </div>

                  {/* Duration Pill at bottom left */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>
                      {tour.durationNights > 0 ? `${tour.durationNights} রাত ` : ""}
                      {tour.durationDays} দিন
                    </span>
                  </div>

                  {/* Popular or Batch Tag */}
                  {tour.batchName && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      {tour.batchName}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Destination Pill */}
                    <div className="flex items-center gap-1 text-xs text-teal-700 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{tour.destination}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                      {tour.title}
                    </h3>

                    {/* Short description / highlights */}
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                      {tour.description}
                    </p>

                    {/* Departure Date string */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>যাত্রা: {tour.startDate} (শুক্রবার)</span>
                    </div>
                  </div>

                  {/* Pricing and Seats Strip */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
                          ৳{tour.basePrice.toLocaleString("en-US")}
                          <span className="text-xs font-normal text-slate-500 ml-1">থেকে</span>
                        </div>
                        <span className="text-[11px] text-slate-400">জনপ্রতি</span>
                      </div>

                      {/* Seats badge */}
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{tour.availableSeats}টি সিট খালি</span>
                      </div>
                    </div>

                    {/* Action link */}
                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-600">
                      <span>বিস্তারিত দেখুন</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
