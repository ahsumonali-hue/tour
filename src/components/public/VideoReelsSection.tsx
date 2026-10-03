"use client";

import React, { useState } from "react";
import { Play, X, Sparkles, Video, Volume2 } from "lucide-react";

export function VideoReelsSection() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const reels = [
    {
      id: "v-sajek-1",
      title: "সাজেক ভ্যালিতে চাঁদের গাড়ি রাইড",
      location: "খাগড়াছড়ি - সাজেক",
      duration: "0:45",
      thumbnail: "https://images.pexels.com/photos/11334337/pexels-photo-11334337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      caption: "পাহাড়ি আঁকাবাঁকা পথে রোমাঞ্চকর জার্নি ও গান-বাজনা!",
    },
    {
      id: "v-sada-pathor",
      title: "ভোলাগঞ্জ সাদা পাথরে শীতল জলকেলি",
      location: "ভোলাগঞ্জ, সিলেট",
      duration: "1:12",
      thumbnail: "https://images.pexels.com/photos/29280001/pexels-photo-29280001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      caption: "স্বচ্ছ স্ফটিক পানিতে বন্ধুদের সাথে রিফ্রেশিং মুহূর্ত।",
    },
    {
      id: "v-cox-bbq",
      title: "সেন্টমার্টিন বিচে লাইভ কোরাল বারবিকিউ",
      location: "সেন্টমার্টিন পশ্চিম সৈকত",
      duration: "0:58",
      thumbnail: "https://images.pexels.com/photos/38655295/pexels-photo-38655295.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      caption: "সমুদ্রের গর্জন আর গরম গরম তাজা কোরাল মাছের বারবিকিউ!",
    },
  ];

  return (
    <section id="video-reels" className="py-16 sm:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
            <Video className="w-3.5 h-3.5" />
            <span>লাইভ ভিডিও মোমেন্টস</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ক্যামেরায় ধারণ করা ভিডিও স্মৃতি
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            আমাদের ট্যুর হোস্ট ও ফটোগ্রাফারদের তোলা সেরা কিছু ভিডিও ক্লিপ
          </p>
        </div>

        {/* Video Cards Grid matching Screenshot 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveVideoModal(reel.id)}
              className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-4/3 bg-slate-800 border border-slate-700/80 hover:border-amber-400 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

              {/* Play Button Icon Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Duration badge top right */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                {reel.duration}
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] bg-teal-800/80 text-teal-200 px-2 py-0.5 rounded-md font-bold uppercase">
                  {reel.location}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {reel.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">{reel.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-6 text-center space-y-4">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </div>

            <h3 className="text-lg font-bold text-white">ভিডিও ক্লিপ রানিং</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              আমাদের ফেসবুক ও ইউটিউব পেজে সম্পূর্ণ ভিডিও ও ভ্রমণভ্লগ দেখতে পারেন!
            </p>

            <button
              onClick={() => setActiveVideoModal(null)}
              className="px-6 py-2 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
