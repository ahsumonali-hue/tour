"use client";

import React from "react";
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, Navigation } from "lucide-react";

export function OfficeMapSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-900 text-xs font-bold mb-2">
            <span>সরাসরি সাক্ষাৎ ও যোগাযোগ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            অফিসে চলে আসুন, অথবা একটা কল দিন
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            আমরা সপ্তাহের ৭ দিনই আপনার ভ্রমণ পরিকল্পনা সাজাতে উপস্থিত আছি
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Office details matching Screenshot 9 */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Office Address Card */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">রাজশাহী প্রধান অফিস</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                ভদ্রা মোড় (বিকাশ অফিসের ২য় তলা), ভদ্রা রেলগেট সংলগ্ন, রাজশাহী-৬০০০
              </p>
            </div>

            {/* Hotline & Phone Card */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
                <Phone className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">হটলাইন ও সরাসরি কল</h3>
              <div className="text-base font-black text-teal-900">
                <a href="tel:01782250709" className="hover:underline">০১৭৮২-২৫০৭০৯</a>
              </div>
              <p className="text-[11px] text-slate-500">সকাল ৯:০০টা হতে রাত ১১:০০টা পর্যন্ত</p>
            </div>

            {/* WhatsApp Support Card */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950">হোয়াটসঅ্যাপ সাপোর্ট</h3>
              <a
                href="https://wa.me/8801782250709"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1.5"
              >
                <span>+880 1782-250709</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.2 rounded-full">
                  Online
                </span>
              </a>
            </div>

          </div>

          {/* Right Column: Embedded Stylized Map Pin Card matching Screenshot 9 */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[350px] flex flex-col justify-between p-6 text-white">
            
            {/* Background simulated Google map raster graphic */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40" />

            {/* Top location tag */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-bold text-teal-300 backdrop-blur-xs">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>ভদ্রা মোড়, রাজশাহী সদর</span>
              </div>

              <a
                href="https://maps.google.com/?q=Bhadra+Mor+Rajshahi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
              >
                <span>Google Maps এ খুলুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Center Animated Map Pin */}
            <div className="relative z-10 flex flex-col items-center justify-center py-8 space-y-2">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 animate-ping absolute" />
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl ring-4 ring-white/20">
                  <MapPin className="w-7 h-7 fill-current" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-base font-black text-white">
                  Rajshahi Tours & Travels Head Office
                </div>
                <div className="text-xs text-slate-300">
                  ভদ্রা মোড় বিকাশ অফিসের ২য় তলা, রাজশাহী
                </div>
              </div>
            </div>

            {/* Bottom departure notice */}
            <div className="relative z-10 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-teal-200 flex items-center justify-between">
              <span>🚌 সকল দূরপাল্লার ট্যুর এই পয়েন্ট থেকেই ছাড়ে</span>
              <span className="font-bold text-amber-400">রিপোর্টিং পয়েন্ট</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
