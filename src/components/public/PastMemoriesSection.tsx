"use client";

import React from "react";
import { Play, Sparkles, MapPin, Users, Star, ArrowRight } from "lucide-react";

interface PastMemoriesSectionProps {
  onSelectMemoryTour?: (tourName: string) => void;
}

export function PastMemoriesSection({ onSelectMemoryTour }: PastMemoriesSectionProps) {
  const memories = [
    {
      id: "mem-sajek",
      title: "রাজশাহী টু সাজেক ও খাগড়াছড়ি",
      tag: "মেঘের রাজ্য",
      travelersCount: "৪২ জন ভ্রমণকারী",
      rating: "৫.০ ★★★★★",
      coverImage: "https://images.pexels.com/photos/6128962/pexels-photo-6128962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      description: "রুইলুই পাড়ায় মেঘের ওপরে ব্যাম্বু বিরিয়ানি পার্টি ও কংলাক পাহাড়ে সূর্যাস্ত দেখা।",
      badge: "সেপ্টেম্বর ব্যাচ",
    },
    {
      id: "mem-puthia",
      title: "পাহাড়পুর ও পুঠিয়া রাজবাড়ি ডে লং",
      tag: "ঐতিহাসিক স্থাপত্য",
      travelersCount: "২৮ জন ভ্রমণকারী",
      rating: "৪.৯ ★★★★★",
      coverImage: "https://images.pexels.com/photos/10615213/pexels-photo-10615213.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      description: "টেরাকোটা শিব মন্দির ও বাঘা মসজিদে কাঁচাগোল্লা উৎসবের চমৎকার ১ দিনের ডে ট্যুর।",
      badge: "আগস্ট ব্যাচ",
    },
    {
      id: "mem-ratargul",
      title: "কুয়াকাটা — সাগরকন্যা সূর্যাস্ত",
      tag: "সমুদ্র সৈকত",
      travelersCount: "৩৫ জন ভ্রমণকারী",
      rating: "৫.০ ★★★★★",
      coverImage: "https://images.pexels.com/photos/38655295/pexels-photo-38655295.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      description: "সূর্যোদয় ও সূর্যাস্তের অপরূপ দৃশ্য এবং লাল কাঁকড়ার চরে অবিস্মরণীয় আনন্দ।",
      badge: "জুলাই ব্যাচ",
    },
  ];

  return (
    <section id="past-memories" className="py-16 sm:py-24 bg-[#0a2321] text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header matching Screenshot 4 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>স্মৃতির পাতায় রাজশাহী ট্যুরস</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              মেঘের রাজ্যে আমরা — একনজর স্মৃতি
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-teal-200/80 max-w-xl leading-relaxed">
              আগের ব্যাচগুলোতে আমাদের সাথে ঘুরে আসা পর্যটকদের আনন্দঘন মুহূর্ত ও অবিস্মরণীয় ফ্রেমগুলো দেখুন।
            </p>
          </div>

          <a
            href="#reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-900/80 hover:bg-teal-800 text-teal-200 hover:text-white border border-teal-700/60 text-xs font-bold transition-all shrink-0"
          >
            <span>ভ্রমণকারীদের মন্তব্য পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Large Memory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {memories.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden bg-teal-950/60 border border-teal-700/40 hover:border-teal-400 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/30 to-transparent" />

                {/* Badge top-left */}
                <div className="absolute top-3 left-3 bg-amber-500 text-teal-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {item.badge}
                </div>

                {/* Tag bottom-left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-xl">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{item.tag}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-teal-800/60 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.travelersCount}</span>
                  </span>

                  <span className="text-amber-400 font-bold text-[11px]">
                    {item.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
