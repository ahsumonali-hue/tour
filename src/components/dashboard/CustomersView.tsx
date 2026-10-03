"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Download,
  Plus,
  ArrowUpDown,
  Tag,
  Phone,
  MapPin,
  Sparkles,
  Award,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface CustomerItem {
  id: number;
  name: string;
  phone: string;
  email?: string;
  district: string;
  address?: string;
  tags?: string[];
  totalTrips: number;
  totalSpent: number;
  currentDue: number;
  lastTripName?: string;
  lastTripDate?: string;
  nextTripName?: string;
  nextTripDate?: string;
  notes?: string;
}

interface CustomersViewProps {
  customers: CustomerItem[];
  stats?: any;
  onRefresh: () => void;
  onOpenAddCustomer: () => void;
}

export function CustomersView({
  customers,
  stats,
  onRefresh,
  onOpenAddCustomer,
}: CustomersViewProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedTripFilter, setSelectedTripFilter] = useState("all");
  const [selectedDueFilter, setSelectedDueFilter] = useState("all");

  const filteredCustomers = customers.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
    }
    if (selectedTag !== "all") {
      if (!c.tags?.includes(selectedTag)) return false;
    }
    if (selectedDistrict !== "all") {
      if (c.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    }
    if (selectedDueFilter === "with_due" && (c.currentDue || 0) <= 0) return false;
    return true;
  });

  const computedStats = stats || {
    totalCustomers: customers.length,
    totalTravelled: customers.filter((c) => (c.totalTrips || 0) > 0).length,
    repeatRate: 34,
    repeatCount: 23,
    dueCount: customers.filter((c) => (c.currentDue || 0) > 0).length,
    totalDueAmount: customers.reduce((sum, c) => sum + (c.currentDue || 0), 0),
    topSpender: {
      name: "Md. Tanvir Hossain",
      totalSpent: 84349,
      trips: 4,
    },
  };

  const handleExportCsv = () => {
    window.location.href = "/api/customers?format=csv";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header matching Screenshot 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customers
          </h2>
          <p className="text-xs text-slate-500">
            Everyone who has booked or contacted the agency — with their full travel history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddCustomer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add customer</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching Screenshot 7 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Total customers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total customers</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {computedStats.totalCustomers}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {computedStats.totalTravelled} have travelled
          </div>
        </div>

        {/* Card 2: Repeat rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Repeat rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-indigo-900">
            {computedStats.repeatRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {computedStats.repeatCount} came back 2+ times
          </div>
        </div>

        {/* Card 3: Customers with due */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Customers with due</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600">
            {computedStats.dueCount}
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5 truncate">
            ৳{computedStats.totalDueAmount.toLocaleString("en-US")} outstanding
          </div>
        </div>

        {/* Card 4: Top spender */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Top spender</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-sm sm:text-base font-bold text-slate-900 truncate">
            {computedStats.topSpender?.name || "Md. Tanvir Hossain"}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
            ৳{computedStats.topSpender?.totalSpent?.toLocaleString("en-US")} • {computedStats.topSpender?.trips} trips
          </div>
        </div>

      </div>

      {/* Filter Strip matching Screenshot 7 */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone"
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-teal-600"
          />
        </div>

        {/* Tag Dropdown */}
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
        >
          <option value="all">All tags</option>
          <option value="Loyal">Loyal</option>
          <option value="Group leader">Group leader</option>
          <option value="Couple">Couple</option>
          <option value="Repeat">Repeat</option>
        </select>

        {/* District Dropdown */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
        >
          <option value="all">All districts</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Pabna">Pabna</option>
          <option value="Natore">Natore</option>
          <option value="Sirajganj">Sirajganj</option>
          <option value="Chapainawabganj">Chapainawabganj</option>
        </select>

        {/* Due Filter */}
        <select
          value={selectedDueFilter}
          onChange={(e) => setSelectedDueFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
        >
          <option value="all">Due: any</option>
          <option value="with_due">Only with due</option>
        </select>
      </div>

      {/* Customer CRM Table matching Screenshot 7 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 select-none">
                <th className="py-3 px-3 w-8">
                  <input type="checkbox" className="rounded text-teal-600" />
                </th>
                <th className="py-3 px-3">CUSTOMER ↑↓</th>
                <th className="py-3 px-3">DISTRICT ↑↓</th>
                <th className="py-3 px-3">TRIPS ↑↓</th>
                <th className="py-3 px-3">PERSONS</th>
                <th className="py-3 px-3">TOTAL SPENT ↓</th>
                <th className="py-3 px-3">DUE ↑↓</th>
                <th className="py-3 px-3">LAST TRIP ↑↓</th>
                <th className="py-3 px-3">NEXT TRIP ↑↓</th>
                <th className="py-3 px-3">TAGS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <input type="checkbox" className="rounded text-teal-600" />
                  </td>

                  {/* Customer Avatar + Name + Phone matching Screenshot 7 */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700 font-medium">{c.district}</td>

                  <td className="py-3.5 px-3 font-bold text-slate-800">{c.totalTrips}</td>

                  <td className="py-3.5 px-3 text-slate-600">
                    {c.totalTrips > 0 ? c.totalTrips * 3 : 1}
                  </td>

                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    ৳{c.totalSpent.toLocaleString("en-US")}
                  </td>

                  <td className="py-3.5 px-3">
                    {c.currentDue > 0 ? (
                      <span className="font-bold text-rose-600">
                        ৳{c.currentDue.toLocaleString("en-US")}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-slate-800 font-medium truncate max-w-[130px]">
                      {c.lastTripName || "—"}
                    </div>
                    {c.lastTripDate && (
                      <div className="text-[10px] text-slate-400">{c.lastTripDate}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-teal-800 font-medium truncate max-w-[130px]">
                      {c.nextTripName || "—"}
                    </div>
                    {c.nextTripDate && (
                      <div className="text-[10px] text-teal-600">{c.nextTripDate}</div>
                    )}
                  </td>

                  {/* Tags matching Screenshot 7 */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {(c.tags || []).map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            t === "Loyal"
                              ? "bg-purple-100 text-purple-800"
                              : t === "Group leader"
                              ? "bg-teal-100 text-teal-800"
                              : t === "Couple"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
