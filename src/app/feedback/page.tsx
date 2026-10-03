"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, ArrowLeft, Compass, Send } from "lucide-react";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tourTitle, setTourTitle] = useState("রাজশাহী টু সাজেক ও খাগড়াছড়ি");
  const [rating, setRating] = useState(5);
  const [likedFeatures, setLikedFeatures] = useState<string[]>([
    "খাবার খুব ভালো ছিল",
    "গাইড আন্তরিক ছিল",
  ]);
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featureOptions = [
    "খাবার খুব ভালো ছিল",
    "গাইড ও হোস্ট আন্তরিক ছিল",
    "বাস ও জার্নি আরামদায়ক ছিল",
    "রিসোর্ট ও রুম ব্যবস্থা চমৎকার",
    "সময়মত সাইটসিয়িং ও নিরাপত্তা",
    "ফটোগ্রাফি ও স্পেশাল স্মৃতি",
  ];

  const toggleFeature = (feat: string) => {
    setLikedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name || "ভ্রমণকারী",
          customerPhone: phone,
          tourTitle,
          rating,
          likedFeatures,
          reviewText: suggestion || "অসাধারণ ট্যুর ছিল, আবারো যাবো!",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Top Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-teal-800 text-xs font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>মূল ওয়েবসাইটে ফিরুন</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Compass className="w-4 h-4 text-teal-700" />
            <span>Rajshahi Tours & Travels</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                ধন্যবাদ {name}! আপনার ফিডব্যাক গৃহীত হয়েছে
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                আপনার মূল্যবান মতামত আমাদের সেবার মান আরও উন্নত করতে সহায়তা করবে। আবারো আমাদের সাথে ভ্রমণের আমন্ত্রণ রইলো!
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2.5 rounded-xl bg-teal-900 text-white text-xs font-bold shadow-md hover:bg-teal-950"
              >
                ওয়েবসাইটে ফিরে যান →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">
                  Traveler Feedback
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  আপনার ট্যুর অভিজ্ঞতা কেমন ছিল?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আমরা প্রতিটি ভ্রমণকারীর মতামত অত্যন্ত গুরুত্বের সাথে বিবেচনা করি।
                </p>
              </div>

              {/* Star Rating Picker */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  সামগ্রিক রেটিং (Overall Rating)
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-120 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-amber-600">
                  {rating === 5
                    ? "অসাধারণ! (Awesome, will go again)"
                    : rating === 4
                    ? "খুব ভালো ছিল (Very Good)"
                    : rating === 3
                    ? "মোটামুটি (Average)"
                    : "উন্নতি প্রয়োজন"}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: ইশরাত জাহান"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Tour name selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">যে ট্যুরে গিয়েছিলেন</label>
                <select
                  value={tourTitle}
                  onChange={(e) => setTourTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="রাজশাহী টু সাজেক ও খাগড়াছড়ি">রাজশাহী টু সাজেক ও খাগড়াছড়ি</option>
                  <option value="সিলেট — জাফলং, রাতাহগুল ও সাদা পাথর">সিলেট — জাফলং ও সাদা পাথর</option>
                  <option value="কক্সবাজার ও সেন্টমার্টিন — শীতের ব্যাচ">কক্সবাজার ও সেন্টমার্টিন</option>
                  <option value="বান্দরবান — নীলগিরি ও নীলাচল">বান্দরবান — নীলগিরি</option>
                  <option value="সুন্দরবন — ৩ দিন লাক্সারি লঞ্চ">সুন্দরবন লঞ্চ সাফারি</option>
                  <option value="পুঠিয়া রাজবাড়ি ও বাঘা মসজিদ ডে লং">পুঠিয়া রাজবাড়ি ডে লং</option>
                </select>
              </div>

              {/* What did you like checklist matching transcript */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  ট্যুরের কোন কোন বিষয় আপনার বেশি ভালো লেগেছে?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {featureOptions.map((feat) => {
                    const isSelected = likedFeatures.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                          isSelected
                            ? "bg-teal-50 border-teal-500 text-teal-900 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected ? "bg-teal-700 text-white" : "border border-slate-300"
                        }`}>
                          {isSelected && "✓"}
                        </span>
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions / Feedback text matching transcript */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  আপনার মতামত বা উন্নতির কোনো পরামর্শ
                </label>
                <textarea
                  rows={3}
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="যেমন: ভাই হোটেলটা আরেকটু উন্নত করতে পারতেন বা খাবার দারুণ ছিল..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "জমা হচ্ছে..." : "ফিডব্যাক সাবমিট করুন"}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
