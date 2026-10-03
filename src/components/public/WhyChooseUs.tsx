"use client";

import React from "react";
import { ShieldCheck, Bus, UtensilsCrossed, Users, Award, MapPin } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: MapPin,
      title: "রাজশাহী হতে সরাসরি রওনা",
      desc: "ভদ্রা মোড় ও রেলগেট থেকে বাস যাত্রা শুরু। রাজশাহী ও উত্তরবঙ্গের পর্যটকদের জন্য সর্বাধিক সুবিধাজনক শিডিউল।",
    },
    {
      icon: ShieldCheck,
      title: "নিরাপত্তা ও পারিবারিক পরিবেশ",
      desc: "ফিমেল, কাপল ও ফ্যামিলিদের জন্য ১০০% নিরাপদ ও মার্জিত পরিবেশ। প্রতিটি ব্যাচে ডেডিকেটেড নারী-বান্ধব ব্যবস্থাপনা।",
    },
    {
      icon: UtensilsCrossed,
      title: "মানসম্মত দেশীয় ও আঞ্চলিক খাবার",
      desc: "সিস্টেম রেস্তোরাঁ ও পানসীসহ শীর্ষ স্থানীয় রেস্তোরাঁয় স্বাস্থ্যসম্মত ও সুস্বাদু খাবারের নিশ্চয়তা।",
    },
    {
      icon: Bus,
      title: "প্রিমিয়াম ট্রান্সপোর্ট ও রিসোর্ট",
      desc: "আরামদায়ক চেয়ার কোচ বাস, চাঁদের গাড়ি ও চমৎকার কাঠের ভিউ রিসোর্টে নিশ্চিত বুকিং।",
    },
    {
      icon: Users,
      title: "অভিজ্ঞ সার্বক্ষণিক ট্যুর হোস্ট",
      desc: "যাত্রীদের দেখাশোনা, ইন-ট্যুর গাইডেন্স ও সেরা ছবি তোলার জন্য দক্ষ ফটোগ্রাফার হোস্ট।",
    },
    {
      icon: Award,
      title: "স্বচ্ছ হিসাব ও কোন গোপন চার্জ নেই",
      desc: "ট্যুর শুরুর আগেই সব খরচ স্পষ্ট। কোন অনাকাঙ্ক্ষিত হিডেন চার্জ বা বিভ্রান্তি নেই।",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full mb-2">
            <span>কেন রাজশাহী ট্যুরস এন্ড ট্রাভেলস?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            নিশ্চিন্ত ও স্মৃতিময় ভ্রমণের নির্ভরযোগ্য নাম
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            আমরা শুধু ট্যুর পরিচালনা করি না, তৈরি করি আজীবনের সুন্দর এক অভিজ্ঞতা
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all hover:border-teal-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 border border-teal-100">
                  <Icon className="w-6 h-6 text-teal-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
