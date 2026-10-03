"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  MessageSquare,
  Plus,
  Search,
  Star,
  MapPin,
  Building,
  Bus,
  Utensils,
  Anchor,
  Compass,
  Edit2,
  Trash2,
  Phone,
} from "lucide-react";

interface NetworkContactItem {
  id: number;
  businessName: string;
  contactPerson: string;
  phone: string;
  district: string;
  category: string;
  rating: number;
  notes?: string;
  lastUsedDate?: string;
  linkedToursCount?: number;
}

interface NetworkContactsViewProps {
  contacts: NetworkContactItem[];
  onRefresh: () => void;
}

export function NetworkContactsView({
  contacts,
  onRefresh,
}: NetworkContactsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [bName, setBName] = useState("");
  const [cPerson, setCPerson] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cDistrict, setCDistrict] = useState("Sylhet");
  const [cCategory, setCCategory] = useState("hotel");
  const [cRating, setCRating] = useState(5);
  const [cNotes, setCNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "all", label: "All", count: contacts.length, icon: Building },
    { id: "hotel", label: "Hotel", count: contacts.filter((c) => c.category === "hotel").length, icon: Building },
    { id: "resort", label: "Resort", count: contacts.filter((c) => c.category === "resort").length, icon: Building },
    { id: "bus_transport", label: "Bus & transport", count: contacts.filter((c) => c.category === "bus_transport").length, icon: Bus },
    { id: "jeep_chander_gari", label: "Jeep / Chander gari", count: contacts.filter((c) => c.category === "jeep_chander_gari").length, icon: Bus },
    { id: "boat_launch", label: "Boat & launch", count: contacts.filter((c) => c.category === "boat_launch").length, icon: Anchor },
    { id: "restaurant", label: "Restaurant", count: contacts.filter((c) => c.category === "restaurant").length, icon: Utensils },
    { id: "local_guide", label: "Local guide", count: contacts.filter((c) => c.category === "local_guide").length, icon: Compass },
  ];

  const filtered = contacts.filter((c) => {
    if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
    if (selectedDistrict !== "all" && c.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.businessName.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Group contacts by District matching Screenshot 8
  const groupedByDistrict: Record<string, NetworkContactItem[]> = {};
  for (const c of filtered) {
    const dist = c.district || "Others";
    if (!groupedByDistrict[dist]) groupedByDistrict[dist] = [];
    groupedByDistrict[dist].push(c);
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/network-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: bName,
          contactPerson: cPerson,
          phone: cPhone,
          district: cDistrict,
          category: cCategory,
          rating: cRating,
          notes: cNotes,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setBName("");
        setCPerson("");
        setCPhone("");
        setCNotes("");
        onRefresh();
      }
    } catch {
      alert("Failed to add contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header matching Screenshot 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Network contacts
          </h2>
          <p className="text-xs text-slate-500">
            Your people on the ground — {contacts.length} contacts across 10 districts. One tap to call or WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add contact</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips matching Screenshot 8 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-teal-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? "bg-teal-800 text-teal-200" : "bg-slate-100 text-slate-600"
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & District Bar matching Screenshot 8 */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, business, phone, notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
          />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 font-medium"
        >
          <option value="all">All districts</option>
          <option value="Sylhet">Sylhet</option>
          <option value="Sajek">Sajek</option>
          <option value="Khagrachari">Khagrachari</option>
          <option value="Bandarban">Bandarban</option>
          <option value="Cox's Bazar">Cox's Bazar</option>
        </select>
      </div>

      {/* District Sections matching Screenshot 8 */}
      <div className="space-y-6">
        {Object.entries(groupedByDistrict).map(([districtName, districtContacts]) => (
          <div key={districtName} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span>{districtName}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({districtContacts.length} contacts)
              </span>
            </div>

            {/* Cards Grid matching Screenshot 8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districtContacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top Row: Icon, Title & Star Rating */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-100 shrink-0">
                          {c.category === "hotel" || c.category === "resort" ? (
                            <Building className="w-5 h-5 text-teal-700" />
                          ) : c.category === "restaurant" ? (
                            <Utensils className="w-5 h-5 text-amber-600" />
                          ) : c.category === "boat_launch" ? (
                            <Anchor className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Bus className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {c.businessName}
                          </h4>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {c.contactPerson}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: c.rating }).map((_, r) => (
                          <Star key={r} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Location & Category Tag */}
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{c.district}</span>
                      <span className="text-slate-300">•</span>
                      <span className="capitalize">{c.category.replace("_", " ")}</span>
                    </div>

                    {/* Notes Box matching Screenshot 8 */}
                    {c.notes && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed font-sans">
                        {c.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions & Footer */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <a
                        href={`tel:${c.phone}`}
                        className="py-2 px-2.5 rounded-xl bg-teal-900 hover:bg-teal-950 text-white flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="truncate">{c.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {c.lastUsedDate && (
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Last used {c.lastUsedDate}</span>
                        {c.linkedToursCount && <span>{c.linkedToursCount} tours</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Network Ground Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  placeholder="e.g. Hotel Surma View"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Person Name</label>
                <input
                  type="text"
                  required
                  value={cPerson}
                  onChange={(e) => setCPerson(e.target.value)}
                  placeholder="e.g. Abdul Kuddus"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  placeholder="01716-XXXXXX"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">District</label>
                  <select
                    value={cDistrict}
                    onChange={(e) => setCDistrict(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Sylhet">Sylhet</option>
                    <option value="Sajek">Sajek</option>
                    <option value="Khagrachari">Khagrachari</option>
                    <option value="Bandarban">Bandarban</option>
                    <option value="Cox's Bazar">Cox's Bazar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={cCategory}
                    onChange={(e) => setCCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="resort">Resort</option>
                    <option value="bus_transport">Bus & Transport</option>
                    <option value="jeep_chander_gari">Jeep / Chander Gari</option>
                    <option value="boat_launch">Boat & Launch</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="local_guide">Local Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Pricing Info</label>
                <textarea
                  rows={2}
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                  placeholder="e.g. ৪ বেড রুম ২,২০০ টাকা। শাহজালাল মাজারের কাছে।"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-teal-900 text-white rounded-xl font-bold text-xs shadow-md"
              >
                {isSubmitting ? "Saving..." : "Save Contact"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
