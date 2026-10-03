"use client";

import React from "react";
import { Compass, CheckSquare, CreditCard, Bus, ArrowRight } from "lucide-react";

export function BookingStepsSection() {
  const steps = [
    {
      step: "১",
      icon: Compass,
      title: "পছন্দসই ট্যুর বাছুন",
      desc: "আসন্ন ট্যুর তালিকা থেকে আপনার পছন্দের গন্তব্য ও সুবিধাজনক তারিখ নির্বাচন করুন।",
    },
    {
      step: "২",
      icon: CheckSquare,
      title: "প্যাকেজ নির্বাচন করুন",
      desc: "কাপল রুম নাকি ৪ জন শেয়ারিং রুম—আপনার প্রয়োজন অনুযায়ী প্যাকেজ বাছাই করুন।",
    },
    {
      step: "৩",
      icon: CreditCard,
      title: "বিকাশে অ্যাডভান্স করুন",
      desc: "মাত্র ২,০০০ টাকা অগ্রিম প্রদান করে আপনার আসন শতভাগ কনফার্ম করে নিন।",
    },
    {
      step: "৪",
      icon: Bus,
      title: "যাত্রার দিন বাসে উঠুন",
      desc: "নির্ধারিত সময়ে রাজশাহীর ভদ্রা মোড় বা রেলগেটে পৌঁছে রিলাক্সে যাত্রা উপভোগ করুন।",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-900 text-xs font-bold mb-2">
            <span>সহজ ও দ্রুত বুকিং প্রক্রিয়া</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            মাত্র ৪ ধাপে সিট নিশ্চিত
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            কোন ঝামেলা ছাড়া ঘরে বসেই আপনার স্বপ্নের ভ্রমণের সিট বুক করুন
          </p>
        </div>

        {/* 4 Steps Grid matching Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-700 text-teal-800 group-hover:text-white flex items-center justify-center border border-teal-200/60 transition-colors shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-amber-500/80">
                    ধাপ {item.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                  <span>সহজ নিয়মাবলী →</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
