"use client";

import React, { useState } from "react";
import { Utensils, Plus, Trash2 } from "lucide-react";

interface MealMenusViewProps {
  menus: any[];
  onRefresh: () => void;
}

export function MealMenusView({ menus, onRefresh }: MealMenusViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [cost, setCost] = useState("");
  const [desc, setDesc] = useState("");

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/meal-menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mealType,
          costPerPerson: Number(cost),
          description: desc,
        }),
      });
      setShowAddModal(false);
      setName("");
      setCost("");
      setDesc("");
      onRefresh();
    } catch {
      alert("Error adding menu");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            খাবারের মেন্যু ডাটাবেজ (Meal Menus Template)
          </h2>
          <p className="text-xs text-slate-500">
            ট্যুর বানানোর সময় বারবার না লিখে সরাসরি এখান থেকে সকাল, দুপুর ও রাতের খাবার নির্বাচন করুন
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন মেন্যু যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menus.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                m.mealType === "breakfast"
                  ? "bg-amber-100 text-amber-800"
                  : m.mealType === "lunch"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-purple-100 text-purple-800"
              }`}>
                {m.mealType}
              </span>
              <span className="font-bold text-amber-600 text-sm">৳{m.costPerPerson}/জন</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-snug">{m.name}</h4>
            {m.description && <p className="text-xs text-slate-500">{m.description}</p>}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold">নতুন খাবারের আইটেম যোগ করুন</h3>
            <form onSubmit={handleAddMeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">মেন্যুর নাম</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ডিম খিচুড়ি + বেগুন ভাজা + চা"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">ধরণ</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="breakfast">সকালের নাস্তা</option>
                    <option value="lunch">দুপুরের খাবার</option>
                    <option value="snacks">বিকালের নাস্তা</option>
                    <option value="dinner">রাতের ডিনার</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">আনুমানিক খরচ (জনপ্রতি)</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="৳"
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 p-2 bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 p-2 bg-teal-900 text-white rounded-xl font-bold"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
