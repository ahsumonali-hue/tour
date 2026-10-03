"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, Quote, ThumbsUp, CheckCircle, Send } from "lucide-react";

interface ReviewItem {
  id: number;
  customerName: string;
  tourTitle: string;
  rating: number;
  likedFeatures?: string[];
  reviewText: string;
  travelerType?: string;
  createdAt?: string;
}

interface TestimonialsSectionProps {
  reviews: ReviewItem[];
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tourName, setTourName] = useState("সাজেক ও খাগড়াছড়ি");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const defaultReviews: ReviewItem[] = [
    {
      id: 1,
      customerName: "ইশরাত জাহান",
      tourTitle: "রাজশাহী টু সাজেক ও খাগড়াছড়ি",
      rating: 5,
      likedFeatures: ["খাবার খুব ভালো ছিল", "গাইড রকিবুল ভাই আন্তরিক", "চাঁদের গাড়ির ড্রাইভ চমৎকার"],
      reviewText:
        "রাজশাহী থেকে সাজেক যাওয়ার এতো সুন্দর গোছানো ট্যুর আগে পাইনি! সময়মত খাবার ও রুইলুই পাড়ায় সুন্দর রিসোর্ট ব্যবস্থা ছিল। ভবিষ্যতে আবারো যাবো ইনশাআল্লাহ।",
      travelerType: "ফ্যামিলি ট্রাভেলার",
    },
    {
      id: 2,
      customerName: "তানভীর আহমেদ ও ফ্রেন্ডস",
      tourTitle: "সিলেট — জাফলং ও সাদা পাথর",
      rating: 5,
      likedFeatures: ["পানসীর খাবার দারুণ", "হোস্ট কোয়ালিটি সেরা", "টাইম ম্যানেজমেন্ট"],
      reviewText:
        "সাদা পাথরের অভিজ্ঞতা ভাষায় প্রকাশ করার মতো না! গাইড ভাইয়ের ব্যবহার ও আন্তরিকতা মুগ্ধ করেছে। রাজশাহী ট্যুরস এন্ড ট্রাভেলস এর জন্য শুভকামনা।",
      travelerType: "ফ্রেন্ডস গ্রুপ",
    },
    {
      id: 3,
      customerName: "মো. শাহরিয়ার ও ফারজানা",
      tourTitle: "কক্সবাজার ও সেন্টমার্টিন সমুদ্র ভ্রমণ",
      rating: 5,
      likedFeatures: ["কাপল সেফটি", "বারবিকিউ পার্টি", "আরামদায়ক বাস"],
      reviewText:
        "কাপলদের জন্য খুবই নিরাপদ এবং চমৎকার পরিবেশ। বারবিকিউ রাতের আয়োজনটা স্পেশাল ছিল। খাবার ও হোস্টিং ১০ এ ১০!",
      travelerType: "কাপল ট্রিপ",
    },
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          tourTitle: tourName,
          rating,
          reviewText,
          likedFeatures: ["খাবার ও হোস্টিং", "গাইড সার্ভিস"],
        }),
      });
      setSubmitted(true);
    } catch {
      alert("Error submitting feedback");
    }
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-teal-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>ভ্রমণকারীদের বাস্তব অনুভূতি</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              যাত্রীদের মতামত ও রিভিউ
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-teal-200/80 max-w-xl">
              প্রতিটি ট্যুর শেষে যাত্রীদের থেকে নেওয়া ফিডব্যাক। আমরা শতভাগ সততা ও সেবার মান নিশ্চিতে বিশ্বাসী।
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-teal-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>আপনার অভিজ্ঞতা শেয়ার করুন</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayReviews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-teal-900/40 border border-teal-700/40 hover:border-teal-500 rounded-3xl p-6 backdrop-blur-xs flex flex-col justify-between transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s < item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-600 text-slate-600"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-semibold text-teal-300 bg-teal-800/60 px-2.5 py-0.5 rounded-full">
                    {item.travelerType || "ভ্রমণকারী"}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-teal-600/40 mb-2" />

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{item.reviewText}"
                </p>

                {(() => {
                  const features = Array.isArray(item.likedFeatures)
                    ? item.likedFeatures
                    : typeof item.likedFeatures === "string"
                    ? (() => {
                        try {
                          const parsed = JSON.parse(item.likedFeatures);
                          return Array.isArray(parsed) ? parsed : [];
                        } catch {
                          return [];
                        }
                      })()
                    : [];
                  if (!features || features.length === 0) return null;
                  return (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {features.map((f: string, fIdx: number) => (
                        <span
                          key={fIdx}
                          className="text-[10px] bg-teal-800/50 text-teal-200 px-2 py-0.5 rounded-md"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6 pt-4 border-t border-teal-800/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{item.customerName}</div>
                  <div className="text-[11px] text-teal-300">{item.tourTitle}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center font-bold text-xs text-white">
                  {item.customerName.slice(0, 1)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Traveler Feedback Submission Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold">মতামত প্রদানের জন্য ধন্যবাদ!</h3>
                <p className="text-xs text-slate-600">
                  আপনার মূল্যবান রিভিউ আমাদের সেবার মান উন্নয়নে অনেক সাহায্য করবে।
                </p>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-5 py-2 bg-teal-900 text-white rounded-xl text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <h3 className="text-lg font-bold text-teal-950">
                  আপনার ট্যুর অভিজ্ঞতা কেমন ছিল?
                </h3>
                <p className="text-xs text-slate-500">
                  সততার সাথে আপনার রেটিং ও পরামর্শ লিখুন।
                </p>

                {/* Star rating picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রেটিং নির্বাচন করুন:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">যে ট্যুরে গিয়েছিলেন</label>
                  <select
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="রাজশাহী টু সাজেক ও খাগড়াছড়ি">রাজশাহী টু সাজেক ও খাগড়াছড়ি</option>
                    <option value="সিলেট — জাফলং, রাতারগুল ও সাদা পাথর">সিলেট — জাফলং ও সাদা পাথর</option>
                    <option value="কক্সবাজার ও সেন্টমার্টিন — শীতের ব্যাচ">কক্সবাজার ও সেন্টমার্টিন</option>
                    <option value="বান্দরবান — নীলগিরি ও নীলাচল">বান্দরবান — নীলগিরি</option>
                    <option value="সুন্দরবন — ৩ দিন লাক্সারি লঞ্চ">সুন্দরবন লঞ্চ সাফারি</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">আপনার রিভিউ ও পরামর্শ</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="খাবার কেমন ছিল, গাইড সার্ভিস ও গাড়ির ব্যবস্থাপনা কেমন ছিল..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md"
                >
                  রিভিউ জমা দিন
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
