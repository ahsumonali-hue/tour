"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock } from "lucide-react";

export function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          message,
          tourTitle: "সাধারণ যোগাযোগ",
          source: "contact_form",
          status: "new",
        }),
      });
      setSubmitted(true);
    } catch {
      alert("সমস্যা হয়েছে, সরাসরি কল করুন");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Office info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                <span>আমাদের সাথে যুক্ত হোন</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-teal-950 tracking-tight">
                সরাসরি অফিসে আসুন অথবা কল করুন
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                যে কোন কাস্টমাইজড গ্রুপ ট্যুর, কর্পোরেট ভ্রমণ বা যেকোনো তথ্যের জন্য আমরা প্রস্তুত।
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">রাজশাহী প্রধান অফিস:</div>
                  <div className="text-xs sm:text-sm text-slate-700">
                    ভদ্রা মোড় (বিকাশ অফিসের ২য় তলা), ভদ্রা, রাজশাহী-৬০০০
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">হটলাইন ও সরাসরি কল:</div>
                  <div className="text-xs sm:text-sm font-semibold text-teal-900">
                    <a href="tel:01782250709" className="hover:underline">০১৭৮২-২৫০৭০৯</a>
                  </div>
                  <div className="text-[11px] text-slate-500">সকাল ৯টা হতে রাত ১১টা পর্যন্ত</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">হোয়াটসঅ্যাপ চ্যাট:</div>
                  <div className="text-xs sm:text-sm font-semibold text-emerald-800">
                    <a
                      href="https://wa.me/8801782250709?text=Assalamu%20Alaikum%20Rajshahi%20Tours"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>+880 1782-250709</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        Online
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Quick Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              দ্রুত অনুসন্ধান ফরম
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              আপনার তথ্য দিয়ে মেসেজ পাঠান, আমাদের প্রতিনিধি অল্প সময়ের মধ্যে কল ব্যাক করবেন।
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3 bg-white rounded-2xl p-6 border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">মেসেজ সফলভাবে পৌঁছেছে!</h4>
                <p className="text-xs text-slate-600">আমরা খুব দ্রুত আপনার সাথে যোগাযোগ করছি। ধন্যবাদ!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="পুরো নাম"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XX-XXXXXX"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আপনি কোন স্থানে যেতে আগ্রহী বা আপনার প্রশ্ন
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="যেমন: আমরা ৬ জন বন্ধু মিলে সাজেক যেতে চাই, খরচ ও ডিসকাউন্ট জানতে চাই..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-800 to-teal-900 hover:from-teal-900 hover:to-teal-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>মেসেজ পাঠান</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
