"use client";

import React from "react";
import { Phone, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function NextTourCtaBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box matching Screenshot */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-teal-950 to-slate-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-teal-700/50">
          
          {/* Decorative glowing gradient elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Texts */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>সীমিত আসন সংখ্যা • অগ্রিম বুকিং আবশ্যক</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                পরের ট্যুরে আপনার সিটটি কি রেখে গেছেন?
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-light">
                মেঘের সাজেক কিংবা সিলেটের সাদা পাথর—ছুটির দিনে আপনার পছন্দের ব্যাচে সিট পূর্ণ হওয়ার আগেই কনফার্ম করুন।
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-teal-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>বিকাশে মাত্র ২,০০০ টাকা অগ্রিম</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>তাৎক্ষণিক বুকিং কনফার্মেশন SMS</span>
                </span>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href="#upcoming-tours"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>আসন্ন ট্যুর দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/8801782250709?text=Assalamu%20Alaikum%20Rajshahi%20Tours,%20I%20want%20to%20book%20a%20seat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-102"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp বুকিং</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
