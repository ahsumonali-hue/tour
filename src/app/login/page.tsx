"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, User } from "@/context/AuthContext";
import { Compass, Lock, Phone, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { availableUsers, switchUser, setCurrentUser } = useAuth();

  const [phone, setPhone] = useState("01782-250709");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("rtt_user_id", data.user.id);
        }
        router.push("/dashboard");
      } else {
        setErrorMsg(data.error || "লগইন ব্যর্থ হয়েছে");
      }
    } catch {
      setErrorMsg("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccountClick = (user: User) => {
    switchUser(user.id);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Scenic Hero matching Screenshot 1 */}
      <div className="relative hidden lg:flex lg:col-span-6 bg-slate-950 flex-col justify-end p-12 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/11334337/pexels-photo-11334337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1200"
          alt="Rajshahi Tours Scenic Hill Sunrise"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-teal-300 hover:text-white transition-colors mb-4 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-teal-500/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-snug">
            ট্যুর চালান, হিসাব নয়।
          </h2>
          <p className="text-sm xl:text-base text-slate-300 max-w-md leading-relaxed">
            Bookings, payments, SMS, expenses and monthly accounts for Rajshahi Tours & Travels — in one place.
          </p>
        </div>
      </div>

      {/* Right Login Area matching Screenshot 1 */}
      <div className="lg:col-span-6 flex flex-col justify-center p-6 sm:p-12 xl:p-16">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-800 flex items-center justify-center border border-teal-200">
              <Compass className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                Rajshahi Tours & Travels
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Staff dashboard
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in
            </h1>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01782-250709"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-teal-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-teal-600 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-teal-800 hover:bg-teal-900 transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-900/10 hover:shadow-teal-900/20 active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OR TRY A DEMO ACCOUNT SECTION matching Screenshot 1 */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-start text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-white pr-2">
                <span>OR TRY A DEMO ACCOUNT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleDemoAccountClick(user)}
                  className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/90 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left shadow-2xs"
                >
                  {user.avatar && user.avatar.startsWith("http") ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-teal-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-teal-100 text-slate-700 group-hover:text-teal-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {user.avatar || user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-teal-950 truncate">
                      {user.name}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.role === "owner"
                            ? "bg-amber-500"
                            : user.role === "admin"
                            ? "bg-teal-500"
                            : user.role === "tour_guide"
                            ? "bg-indigo-500"
                            : user.role === "accountant"
                            ? "bg-emerald-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <span className="capitalize">{user.role.replace("_", " ")}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
