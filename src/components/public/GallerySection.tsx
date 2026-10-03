"use client";

import React, { useState } from "react";
import { Camera, Play, Image as ImageIcon, Sparkles } from "lucide-react";

export function GallerySection() {
  const [filter, setFilter] = useState("all");

  const galleryItems = [
    {
      id: 1,
      title: "সাজেক ভ্যালিতে মেঘের ওপর সূর্যাস্ত",
      location: "সাজেক, খাগড়াছড়ি",
      image: "https://images.pexels.com/photos/6128962/pexels-photo-6128962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "hills",
      tour: "সাজেক সেপ্টেম্বর ব্যাচ",
    },
    {
      id: 2,
      title: "ভোলাগঞ্জ সাদা পাথরের শীতল জলরাশি",
      location: "ভোলাগঞ্জ, সিলেট",
      image: "https://images.pexels.com/photos/29280001/pexels-photo-29280001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "water",
      tour: "সিলেট আগস্ট ব্যাচ",
    },
    {
      id: 3,
      title: "কক্সবাজার সমুদ্র সৈকতে ফিশ বারবিকিউ নাইট",
      location: "কক্সবাজার",
      image: "https://images.pexels.com/photos/38655295/pexels-photo-38655295.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "sea",
      tour: "কক্সবাজার ব্যাচ",
    },
    {
      id: 4,
      title: "রাতারগুল সোয়াম্প ফরেস্টে নৌকায় টিম ভ্রমণ",
      location: "রাতারগুল, সিলেট",
      image: "https://images.pexels.com/photos/724004/pexels-photo-724004.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "water",
      tour: "সিলেট জুলাই ব্যাচ",
    },
    {
      id: 5,
      title: "নীলগিরির চূড়ায় দাঁড়িয়ে সূর্যোদয়",
      location: "বান্দরবান",
      image: "https://images.pexels.com/photos/14844302/pexels-photo-14844302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "hills",
      tour: "বান্দরবান স্পেশাল",
    },
    {
      id: 6,
      title: "সুন্দরবনের গহীন খালে ক্রুজ শিপ সাফারি",
      location: "সুন্দরবন",
      image: "https://images.pexels.com/photos/36584778/pexels-photo-36584778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "sea",
      tour: "সুন্দরবন লঞ্চ ক্রুজ",
    },
  ];

  const filtered = galleryItems.filter(
    (item) => filter === "all" || item.tag === filter
  );

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>ট্যুর মেমোরিজ ও বাস্তব মুহূর্ত</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            আমাদের আগের ট্যুরের কিছু স্মৃতি
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            আমাদের দক্ষ গাইড ও ফটোগ্রাফারদের ক্যামেরায় ধারণ করা সেরা কিছু ফ্রেম
          </p>

          {/* Filter tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "সব ছবি" },
              { id: "hills", label: "পাহাড় ও মেঘ" },
              { id: "water", label: "ঝর্ণা ও নদী" },
              { id: "sea", label: "সমুদ্র ও দ্বীপ" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === tab.id
                    ? "bg-teal-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden aspect-4/3 bg-slate-100 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md">
                  {item.location}
                </span>
                <h3 className="text-sm sm:text-base font-bold mt-1 text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-teal-200 mt-0.5">{item.tour}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
