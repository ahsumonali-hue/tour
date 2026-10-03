"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  LogIn,
  Download,
  Compass,
  Menu,
  X,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onOpenZipModal?: () => void;
  bannerText?: string;
  phoneText?: string;
}

export function Navbar({
  onOpenZipModal,
  bannerText = "📢 অক্টোবর ব্যাচ: সাজেক ১৬ অক্টোবর ও সিলেট ৩০ অক্টোবর — বুকিং চলছে! পুরনো কাস্টমারদের জন্য ৩০০ টাকা ছাড়!",
  phoneText = "০১৭৮২-২৫০৭০৯",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-teal-100">
      {/* Top Announcement Banner matching Screenshot 2 */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-xs select-none">
        <span className="animate-bounce">📢</span>
        <span className="truncate max-w-4xl">{bannerText}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo with Teal Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-teal-950 tracking-tight leading-tight">
                রাজশাহী ট্যুরস এন্ড ট্রাভেলস
              </div>
              <div className="text-[11px] sm:text-xs text-teal-700 font-semibold tracking-wide">
                Rajshahi Tours & Travels
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links matching Screenshot */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-semibold text-slate-700">
            <Link
              href="#home"
              className="px-3.5 py-2 rounded-xl text-teal-800 bg-teal-50/70 hover:bg-teal-100/70 transition-colors"
            >
              হোম
            </Link>
            <Link
              href="#upcoming-tours"
              className="px-3.5 py-2 rounded-xl hover:text-teal-800 hover:bg-slate-100 transition-colors"
            >
              আসন্ন ট্যুর
            </Link>
            <Link
              href="#past-memories"
              className="px-3.5 py-2 rounded-xl hover:text-teal-800 hover:bg-slate-100 transition-colors"
            >
              আগের ট্যুর
            </Link>
            <Link
              href="#reviews"
              className="px-3.5 py-2 rounded-xl hover:text-teal-800 hover:bg-slate-100 transition-colors"
            >
              রিভিউ
            </Link>
            <Link
              href="#video-reels"
              className="px-3.5 py-2 rounded-xl hover:text-teal-800 hover:bg-slate-100 transition-colors"
            >
              ভিডিও
            </Link>
            <Link
              href="#contact"
              className="px-3.5 py-2 rounded-xl hover:text-teal-800 hover:bg-slate-100 transition-colors"
            >
              যোগাযোগ
            </Link>
          </nav>

          {/* Right Action Buttons matching Screenshot */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Download Project ZIP Button */}
            <button
              onClick={onOpenZipModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full transition-all shadow-2xs"
              title="Download Full Project Source Code (ZIP)"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Project .ZIP</span>
            </button>

            {/* Staff Login Link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-900 hover:text-teal-950 px-3 py-1.5 hover:bg-teal-50 rounded-xl transition-colors"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>Staff login</span>
            </Link>

            {/* Direct Phone Call Button (Orange Pill) matching Screenshot */}
            <a
              href={`tel:${phoneText.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>{phoneText}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenZipModal}
              className="p-2 text-slate-700 bg-slate-100 rounded-xl text-xs"
              title="Download ZIP"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-teal-900 hover:bg-teal-50 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-teal-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <Link
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-bold text-teal-900 bg-teal-50"
          >
            হোম
          </Link>
          <Link
            href="#upcoming-tours"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
          >
            আসন্ন ট্যুর
          </Link>
          <Link
            href="#past-memories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
          >
            আগের ট্যুর
          </Link>
          <Link
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
          >
            রিভিউ
          </Link>
          <Link
            href="#video-reels"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
          >
            ভিডিও ও গ্যালারি
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
          >
            যোগাযোগ
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-teal-50 text-teal-900 border border-teal-200"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff Login Dashboard</span>
            </Link>
            <a
              href={`tel:${phoneText.replace(/[^0-9]/g, "")}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>কল করুন • {phoneText}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
