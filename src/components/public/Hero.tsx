"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowDown, ArrowRight, Calendar, Users, Star, MapPin, Sparkles } from "lucide-react";

interface HeroProps {
  onSelectFeaturedTour: () => void;
  featuredTour?: any;
}

export function Hero({ onSelectFeaturedTour, featuredTour }: HeroProps) {
  const tour = featuredTour || {
    id: "t-sajek-oct",
    title: "রাজশাহী টু সাজেক ও খাগড়াছড়ি ভ্রমণ (অক্টোবর ব্যাচ)",
    batchName: "১৬ অক্টোবর ব্যাচ",
    startDateFormatted: "১৬ অক্টোবর",
    duration: "৩ রাত ২ দিন",
    price: "৳৪,৮০০",
    availableSeats: 7,
    coverImage:
      "https://images.pexels.com/photos/6128962/pexels-photo-6128962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-teal-950/90 via-teal-900/80 to-slate-900 text-white pt-10 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Scenic Image with rich overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6128962/pexels-photo-6128962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000"
          alt="Sajek Mountain Background"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-950/80 to-teal-950/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-teal-950/40 to-teal-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/60 border border-teal-500/30 text-teal-200 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>রাজশাহী থেকে প্রতি মাসে গ্রুপ ট্যুর</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                রাজশাহী থেকে সারা <br className="hidden sm:inline" />
                <span className="relative inline-block text-amber-300">
                  বাংলাদেশ
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-amber-400/80"
                    viewBox="0 0 250 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 14C50 4 150 4 247 16"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed text-teal-50/90 font-light">
              সাজেকের মেঘ, সিলেটের চা-বাগান, সেন্টমার্টিনের নীল পানি — নিরাপদ, সাশ্রয়ী আর গোছানো গ্রুপ ট্যুর। আপনি শুধু ব্যাগ গুছিয়ে ভদ্রা মোড়ে চলে আসুন।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#upcoming-tours"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>আসন্ন ট্যুর দেখুন</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>

              <a
                href="tel:01782250709"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm sm:text-base font-semibold text-teal-100 bg-teal-900/60 hover:bg-teal-800/80 border border-teal-700/60 backdrop-blur-sm transition-all hover:text-white hover:border-teal-500"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>কল করুন • ০১৭৮২-২৫০৭০৯</span>
              </a>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-teal-200/80">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> ভদ্রা মোড় থেকে বাস ছাড়বে
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> অভিজ্ঞ হোস্ট ও নিরাপদ পরিবেশ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> ফিমেল ও কাপল ফ্রেন্ডলি
              </span>
            </div>
          </div>

          {/* Right Column: Featured Tour Card matching Screenshot 2 */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              onClick={onSelectFeaturedTour}
              className="group cursor-pointer w-full max-w-md bg-teal-950/70 border border-teal-600/40 hover:border-teal-400 rounded-3xl p-4 sm:p-5 backdrop-blur-md shadow-2xl transition-all hover:scale-[1.02] hover:shadow-teal-500/10"
            >
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-4">
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  পরবর্তী যাত্রা
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                  {tour.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-teal-200/80">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tour.startDateFormatted || "১৬ অক্টোবর"} • {tour.duration || "৩ রাত ২ দিন"}</span>
                </div>

                <div className="pt-2 border-t border-teal-800/60 flex items-center justify-between">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-amber-400">
                      {tour.price || "৳৪,৮০০"} <span className="text-xs text-slate-300 font-normal">থেকে</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{tour.availableSeats || 7}টি সিট খালি</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs font-medium text-teal-300 group-hover:text-teal-200">
                  <span>বিস্তারিত ও বুকিং</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Stat Counters Bar matching Screenshot 2 */}
        <div className="mt-12 sm:mt-16 bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border border-slate-100">
          <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100 last:border-none">
            <span className="text-2xl sm:text-4xl font-extrabold text-teal-900 tracking-tight">৬০+</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">সফল ট্যুর</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100 last:border-none">
            <span className="text-2xl sm:text-4xl font-extrabold text-teal-900 tracking-tight">২,৫০০+</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">খুশি ভ্রমণকারী</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100 last:border-none">
            <span className="text-2xl sm:text-4xl font-extrabold text-teal-900 tracking-tight">২২</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">গন্তব্য</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-2xl sm:text-4xl font-extrabold text-teal-900 tracking-tight flex items-center gap-1">
              ৪.৮<Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400 inline" />
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">গড় রেটিং</span>
          </div>
        </div>

      </div>
    </section>
  );
}
