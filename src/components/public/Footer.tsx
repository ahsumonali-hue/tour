"use client";

import React from "react";
import Link from "next/link";
import { Compass, Phone, Mail, MapPin, Heart, Download } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-white">
                  রাজশাহী ট্যুরস এন্ড ট্রাভেলস
                </div>
                <div className="text-[11px] text-teal-400">
                  Rajshahi Tours & Travels — রাজশাহী থেকে সারা বাংলাদেশ
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              রাজশাহী থেকে পরিচালিত প্রফেশনাল ট্যুর এজেন্সি। সাজেক, সিলেট, সেন্টমার্টিন, বান্দরবান ও সুন্দরবনের নিয়মিত গ্রুপ ও কাপল প্যাকেজ।
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="/api/download-zip"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-700/60 font-semibold text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Source Code (.ZIP)</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-white">গুরুত্বপূর্ণ লিংক</div>
            <ul className="space-y-2">
              <li>
                <Link href="#upcoming-tours" className="hover:text-teal-400 transition-colors">
                  আসন্ন ট্যুর তালিকা
                </Link>
              </li>
              <li>
                <Link href="#past-tours" className="hover:text-teal-400 transition-colors">
                  আগের ট্যুর গ্যালারি
                </Link>
              </li>
              <li>
                <Link href="#reviews" className="hover:text-teal-400 transition-colors">
                  যাত্রীদের মতামত
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-teal-400 transition-colors">
                  ট্যুর ফিডব্যাক ফর্ম
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors font-medium">
                  স্টাফ ও গাইড লগইন →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-white">যোগাযোগ</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>০১৭৮২-২৫০৭০৯</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>ভদ্রা মোড়, রাজশাহী-৬০০০</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>rajshahitours@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} রাজশাহী ট্যুরস এন্ড ট্রাভেলস। সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1">
            <span>ট্যুর চালান, হিসাব নয় • Developed for Rajshahi Tours</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
