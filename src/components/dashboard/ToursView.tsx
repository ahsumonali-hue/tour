"use client";

import React, { useState } from "react";
import {
  Map,
  Plus,
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
  Bus,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Trash2,
  Edit,
  Utensils,
  Tag,
  Search,
  Image as ImageIcon,
  Check,
  ChevronRight,
  FileText,
  Calculator,
} from "lucide-react";
import { InTourSmsModal } from "./InTourSmsModal";

interface ToursViewProps {
  tours: any[];
  bookings: any[];
  smsLogs: any[];
  onRefresh: () => void;
  onOpenNewBookingForTour: (tour: any) => void;
}

const STOCK_DESTINATION_PHOTOS = [
  {
    url: "https://images.pexels.com/photos/6128962/pexels-photo-6128962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "সাজেক ভ্যালি মেঘ পাহাড়",
    category: "sajek",
  },
  {
    url: "https://images.pexels.com/photos/11334337/pexels-photo-11334337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "সাজেক সূর্যোদয় ও কুয়াশা",
    category: "sajek",
  },
  {
    url: "https://images.pexels.com/photos/29280001/pexels-photo-29280001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "সিলেট চা-বাগান ও সবুজ টিলা",
    category: "sylhet",
  },
  {
    url: "https://images.pexels.com/photos/724004/pexels-photo-724004.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "রাতারগুল সোয়াম্প ফরেস্ট নৌকা",
    category: "sylhet",
  },
  {
    url: "https://images.pexels.com/photos/38655295/pexels-photo-38655295.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "কক্সবাজার সমুদ্র সৈকত ও নৌকা",
    category: "sea",
  },
  {
    url: "https://images.pexels.com/photos/14844302/pexels-photo-14844302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "বান্দরবান নীলগিরি মেঘের সাগর",
    category: "hills",
  },
  {
    url: "https://images.pexels.com/photos/36584778/pexels-photo-36584778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "সুন্দরবন লাক্সারি ক্রুজ লঞ্চ",
    category: "sea",
  },
  {
    url: "https://images.pexels.com/photos/10615213/pexels-photo-10615213.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "পুঠিয়া টেরাকোটা রাজবাড়ি ও মন্দির",
    category: "history",
  },
];

export function ToursView({
  tours,
  bookings,
  smsLogs,
  onRefresh,
  onOpenNewBookingForTour,
}: ToursViewProps) {
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"bookings" | "sms" | "budget" | "plan">("bookings");
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMediaPickerModal, setShowMediaPickerModal] = useState(false);

  // Filter state for tour list
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTour, setSearchTour] = useState("");

  const filteredTours = tours.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (searchTour) {
      return (
        t.title.toLowerCase().includes(searchTour.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchTour.toLowerCase())
      );
    }
    return true;
  });

  // Tour Creation Full 8-Step Wizard State matching Screenshots 14-19
  const [wizardStep, setWizardStep] = useState<
    "basic" | "schedule" | "media" | "packages" | "transport" | "food" | "itinerary" | "budget"
  >("basic");

  const [formTitle, setFormTitle] = useState("রাজশাহী টু সাজেক ও খাগড়াছড়ি ভ্রমণ");
  const [formDestination, setFormDestination] = useState("সাজেক ভ্যালি ও খাগড়াছড়ি");
  const [formBatchName, setFormBatchName] = useState("১৬ অক্টোবর ব্যাচ");
  const [formStatus, setFormStatus] = useState("published");
  const [formStartDate, setFormStartDate] = useState("2026-10-16");
  const [formDays, setFormDays] = useState(2);
  const [formNights, setFormNights] = useState(3);
  const [formDeparture, setFormDeparture] = useState("ভদ্রা মোড় / রেলগেট, রাজশাহী");
  const [formSeats, setFormSeats] = useState(40);
  const [formBasePrice, setFormBasePrice] = useState(4800);
  const [formCoverImage, setFormCoverImage] = useState(STOCK_DESTINATION_PHOTOS[0].url);
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([
    STOCK_DESTINATION_PHOTOS[0].url,
    STOCK_DESTINATION_PHOTOS[1].url,
  ]);
  const [formBusType, setFormBusType] = useState("নন-এসি চেয়ার কোচ + চান্দের গাড়ি");
  const [formAssignedGuides, setFormAssignedGuides] = useState(["Rakibul Islam"]);
  const [formCouplePrice, setFormCouplePrice] = useState(15000);
  const [formSharedPrice, setFormSharedPrice] = useState(3800);
  const [formAddonPrice, setFormAddonPrice] = useState(200);

  // Budget states
  const [formBusCost, setFormBusCost] = useState(45000);
  const [formHotelCost, setFormHotelCost] = useState(28000);
  const [formFoodCost, setFormFoodCost] = useState(35000);
  const [formGuideCost, setFormGuideCost] = useState(6000);
  const [formTicketsCost, setFormTicketsCost] = useState(4500);

  const [isCreating, setIsCreating] = useState(false);

  // Auto calculate return date
  const computeEndDate = (start: string, nights: number) => {
    try {
      const d = new Date(start);
      d.setDate(d.getDate() + nights);
      return d.toISOString().split("T")[0];
    } catch {
      return start;
    }
  };

  const calculatedEndDate = computeEndDate(formStartDate, formNights);

  // Budget calculations matching transcript
  const estTotalBudget = formBusCost + formHotelCost + formFoodCost + formGuideCost + formTicketsCost + 2500;
  const breakEvenPersons = Math.ceil(estTotalBudget / (formBasePrice || 4800));

  const handleCreateTourSubmit = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          destination: formDestination,
          batchName: formBatchName,
          startDate: formStartDate,
          endDate: calculatedEndDate,
          durationDays: formDays,
          durationNights: formNights,
          departureFrom: formDeparture,
          totalSeats: formSeats,
          basePrice: formBasePrice,
          coverImage: formCoverImage,
          galleryImages: formGalleryImages,
          busType: formBusType,
          status: formStatus,
          packages: [
            {
              name: "৪ জন ১ রুমে (নন-এসি কাঠের রিসোর্ট)",
              pricePerPerson: formSharedPrice,
              roomType: "4 in 1 Room",
              isDefault: true,
            },
            {
              name: "কাপল প্যাকেজ - এসি কাঠের রিসোর্ট (২ জন)",
              pricePerPerson: Math.round(formCouplePrice / 2),
              roomType: "AC Couple",
              isDefault: false,
            },
          ],
          addons: [
            { name: "আলুটিলা গুহা ও রিসাং ঝর্ণা টিকিট", price: formAddonPrice },
          ],
          budgetData: {
            busCost: formBusCost,
            hotelCost: formHotelCost,
            foodCost: formFoodCost,
            guideFee: formGuideCost,
            ticketsCost: formTicketsCost,
            otherCost: 2500,
            estTotalCost: estTotalBudget,
            estMinPersons: 35,
            breakEvenPersons: breakEvenPersons,
          },
          foodPlan: [
            {
              day: 1,
              breakfast: "ডিম খিচুড়ি + বেগুন ভাজা + স্পেশাল পাহাড়ি চা",
              lunch: "পাহাড়ি দেশি মুরগি + সবজি + ডাল + সাদা ভাত",
              snacks: "পাহাড়ি পাহাড়ে পাহাড়ি ফল ও চা",
              dinner: "ব্যাম্বু চিকেন বিরিয়ানি + সালাদ + সফট ড্রিংকস",
            },
            {
              day: 2,
              breakfast: "ভূনা পরোটা + ডিম পোচ + আলুর দম + চা",
              lunch: "সিস্টেম রেস্তোরাঁয় পাহাড়ি স্পেশাল হাসের মাংস + ভর্তা ভাত",
              snacks: "সন্ধ্যায় ঝালমুড়ি ও চা",
              dinner: "খাগড়াছড়িতে রওয়ানা ও ডিনার",
            },
          ],
          itinerary: [
            {
              day: 1,
              title: "রাজশাহী হতে খাগড়াছড়ি হয়ে মেঘের সাজেক",
              description: "সকালে সাজেক পৌঁছে চেক-ইন ও লাঞ্চ। বিকেলে কংলাক পাহাড়ে সূর্যাস্ত দর্শন ও রাতে ব্যাম্বু পার্টি।",
              spots: ["হাজাছড়া ঝর্ণা", "রুইলুই পাড়া", "কংলাক পাহাড়", "হেলিপ্যাড"],
            },
            {
              day: 2,
              title: "সূর্যোদয় দর্শন, আলুটিলা গুহা ও ফিরতি যাত্রা",
              description: "ভোরে হেলিপ্যাডে সূর্যোদয় দেখা। আলুটিলা গুহা ও রিসাং ঝর্ণা এক্সপ্লোর শেষে রাতে রাজশাহীর বাসে ওঠা।",
              spots: ["হেলিপ্যাড সূর্যোদয়", "আলুটিলা গুহা", "রিসাং ঝর্ণা"],
            },
          ],
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setWizardStep("basic");
        onRefresh();
      } else {
        alert("ট্যুর তৈরি ব্যর্থ হয়েছে");
      }
    } catch {
      alert("ত্রুটি হয়েছে");
    } finally {
      setIsCreating(false);
    }
  };

  // Detailed selected tour view matching Screenshot 4
  if (selectedTour) {
    const tourBookings = bookings.filter((b) => b.tourId === selectedTour.id);
    const tourSms = smsLogs.filter((s) => s.tourId === selectedTour.id);
    const bookedPersons = tourBookings.reduce((sum, b) => sum + (b.personsCount || 1), 0);
    const totalCollected = tourBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const totalDue = tourBookings.reduce((sum, b) => sum + (b.dueAmount || 0), 0);

    return (
      <div className="space-y-6">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <button
              onClick={() => setSelectedTour(null)}
              className="text-xs font-bold text-teal-800 hover:underline mb-1"
            >
              ← সব ট্যুর তালিকায় ফিরে যান
            </button>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {selectedTour.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>📅 {selectedTour.startDate} হতে {selectedTour.endDate}</span>
              <span>• {selectedTour.batchName}</span>
              <span>• বাস: {selectedTour.busType}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNewBookingForTour(selectedTour)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>বুকিং যুক্ত করুন</span>
            </button>

            <button
              onClick={() => setShowSmsModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>SMS ব্রডকাস্ট</span>
            </button>
          </div>
        </div>

        {/* Tour Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500">বুকিং করা যাত্রী</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {bookedPersons} / {selectedTour.totalSeats} জন
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {Math.max(0, selectedTour.totalSeats - bookedPersons)}টি সিট বাকি
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500">আদায়কৃত পেমেন্ট</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-1">
              ৳{totalCollected.toLocaleString("en-US")}
            </div>
            <div className="text-[11px] text-slate-400">বিকাশ/নগদ/ক্যাশ</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500">বকেয়া টাকা</div>
            <div className="text-xl font-extrabold text-rose-600 mt-1">
              ৳{totalDue.toLocaleString("en-US")}
            </div>
            <div className="text-[11px] text-rose-500">যাত্রীদের থেকে প্রাপ্য</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500">ব্রেক-ইভেন সিট সংখ্যা</div>
            <div className="text-xl font-extrabold text-teal-900 mt-1">
              {selectedTour.budgetData?.breakEvenPersons || 26} জন
            </div>
            <div className="text-[11px] text-teal-700">লাভ নিশ্চিত হতে প্রয়োজন</div>
          </div>
        </div>

        {/* Sub Tabs matching Screenshot 4 */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-3xl px-6 pt-3 gap-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveSubTab("bookings")}
            className={`pb-3 border-b-2 transition-colors ${
              activeSubTab === "bookings"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-teal-700"
            }`}
          >
            ভ্রমণকারীদের বুকিং তালিকা ({tourBookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab("sms")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubTab === "sms"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-teal-700"
            }`}
          >
            <span>ইন-ট্যুর SMS ও ঘোষণা</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </button>
          <button
            onClick={() => setActiveSubTab("budget")}
            className={`pb-3 border-b-2 transition-colors ${
              activeSubTab === "budget"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-teal-700"
            }`}
          >
            বাজেট ও সম্ভাব্য লাভ-ক্ষতি
          </button>
          <button
            onClick={() => setActiveSubTab("plan")}
            className={`pb-3 border-b-2 transition-colors ${
              activeSubTab === "plan"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-500 hover:text-teal-700"
            }`}
          >
            খাবার ও ভ্রমণ প্ল্যান
          </button>
        </div>

        {/* SUB TAB 1: BOOKINGS LIST */}
        {activeSubTab === "bookings" && (
          <div className="bg-white p-6 rounded-b-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                নিশ্চিত বুকিং সমূহ ({tourBookings.length} বুকিং • {bookedPersons} জন যাত্রী)
              </h3>
              <button
                onClick={() => onOpenNewBookingForTour(selectedTour)}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                + নতুন বুকিং যোগ করুন
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-3">বুকিং কোড</th>
                    <th className="py-3 px-3">কাস্টমার নাম ও ফোন</th>
                    <th className="py-3 px-3">প্যাকেজ</th>
                    <th className="py-3 px-3">যাত্রী সংখ্যা</th>
                    <th className="py-3 px-3">সিট নম্বর</th>
                    <th className="py-3 px-3">মোট বিল</th>
                    <th className="py-3 px-3">জমা</th>
                    <th className="py-3 px-3">বকেয়া</th>
                    <th className="py-3 px-3">পেমেন্ট মাধ্যম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tourBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-800">{b.bookingCode}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[11px] text-slate-500">{b.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{b.packageName}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{b.personsCount} জন</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{b.seatNumbers || "Auto"}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">৳{b.totalAmount}</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">৳{b.paidAmount}</td>
                      <td className="py-3 px-3 font-bold text-rose-600">৳{b.dueAmount}</td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {b.paymentMethod}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB TAB 2: SMS BROADCAST TAB matching Screenshot 4 */}
        {activeSubTab === "sms" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-900 to-teal-950 p-4 rounded-2xl text-white">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Send SMS to all travellers</span>
                  </h3>
                  <p className="text-xs text-teal-200/80 mt-0.5">
                    One tap for in-tour announcements. Each message goes directly to the booking holder's phone.
                  </p>
                </div>

                <button
                  onClick={() => setShowSmsModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                >
                  + Custom message
                </button>
              </div>

              {/* Target filter pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200">
                  <div className="text-xs font-bold text-teal-950">All confirmed</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">
                    {tourBookings.length} holders • {bookedPersons} travellers
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-700">Only with due</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {tourBookings.filter((b) => b.dueAmount > 0).length} holders owe money
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-700">Only pending</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">0 unconfirmed bookings</div>
                </div>
              </div>

              {/* Quick messages grid */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick messages (1-Click Send)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowSmsModal(true)}
                    className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                      <span>🍛 দুপুরের খাবার রেডি</span>
                      <Send className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[11px] text-amber-800 mt-1">
                      Lunch call • {tourBookings.length} recipients
                    </div>
                  </button>

                  <button
                    onClick={() => setShowSmsModal(true)}
                    className="p-3 rounded-2xl bg-teal-50/70 hover:bg-teal-100 border border-teal-200 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-teal-950">
                      <span>⏰ বিকাল ৪টায় ঘুরতে বের হওয়া</span>
                      <Send className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[11px] text-teal-800 mt-1">
                      Meet-up for sightseeing
                    </div>
                  </button>

                  <button
                    onClick={() => setShowSmsModal(true)}
                    className="p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                      <span>🚌 বাস ছাড়ছে ১৫ মিনিটের মধ্যে</span>
                      <Send className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[11px] text-indigo-800 mt-1">
                      Departure alert
                    </div>
                  </button>
                </div>
              </div>

              {/* SMS Sent History Table */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
                    <span>SMS sent for this tour ({tourSms.length} sends)</span>
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">SENT</th>
                        <th className="py-2.5 px-3">BY</th>
                        <th className="py-2.5 px-3">TYPE</th>
                        <th className="py-2.5 px-3">MESSAGE</th>
                        <th className="py-2.5 px-3">TO</th>
                        <th className="py-2.5 px-3">DELIVERED</th>
                        <th className="py-2.5 px-3">COST</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tourSms.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">Today</td>
                          <td className="py-2.5 px-3 text-slate-800 font-semibold">{s.senderName}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                              {s.smsType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">{s.message}</td>
                          <td className="py-2.5 px-3 font-bold">{s.recipientCount}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-bold">{s.deliveryStatus || "Delivered"}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">৳{s.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUB TAB 3: BUDGET */}
        {activeSubTab === "budget" && (
          <div className="bg-white p-6 rounded-b-3xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ট্যুর বাজেট ও ব্রেক-ইভেন অ্যানালাইসিস
              </h3>
              <p className="text-xs text-slate-500">
                এই ট্যুরে কতজন যাত্রী গেলে খরচ উঠে আসবে এবং কতজন হলে নিট লাভ হবে তার স্বয়ংক্রিয় হিসাব।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase">আনুমানিক সম্ভাব্য খরচ:</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>বাস / পরিবহন ভাড়া:</span>
                    <span className="font-bold">৳{selectedTour.budgetData?.busCost || 45000}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>হোটেল ও রিসোর্ট স্টে:</span>
                    <span className="font-bold">৳{selectedTour.budgetData?.hotelCost || 28000}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>খাবার খরচ (৫ বেলা):</span>
                    <span className="font-bold">৳{selectedTour.budgetData?.foodCost || 35000}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>ট্যুর গাইড ও হোস্ট ফি:</span>
                    <span className="font-bold">৳{selectedTour.budgetData?.guideFee || 6000}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>স্পট এন্ট্রি ও অন্যান্য:</span>
                    <span className="font-bold">৳{selectedTour.budgetData?.ticketsCost || 4500}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-sm text-slate-900">
                    <span>সর্বমোট বাজেট:</span>
                    <span className="text-rose-600">৳{selectedTour.budgetData?.estTotalCost || 121000}</span>
                  </div>
                </div>
              </div>

              <div className="bg-teal-950 text-white p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    ব্রেক-ইভেন ও লাভ পূর্বাভাস
                  </span>
                  <div className="mt-3 text-3xl font-black text-amber-300">
                    {selectedTour.budgetData?.breakEvenPersons || 26} জন
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    ট্যুরে কমপক্ষে ২৬ জন যাত্রী পূর্ণ হলে ট্যুরের মোট বাজেট কভার হয়ে যাবে।
                  </p>
                </div>

                <div className="pt-3 border-t border-teal-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span>টার্গেট ক্যাপাসিটি (৩৫ জন):</span>
                    <span className="font-bold text-emerald-400">+৳৪৭,০০০ আনুমানিক নিট লাভ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>বর্তমান বুকিং কালেকশন:</span>
                    <span className="font-bold text-amber-300">৳{totalCollected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 4: PLAN & FOOD */}
        {activeSubTab === "plan" && (
          <div className="bg-white p-6 rounded-b-3xl border border-slate-200 shadow-2xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900">খাবারের আয়োজন ও স্পট সূচি</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedTour.foodPlan || []).map((fp: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-teal-900">দিন {fp.day || idx + 1} এর খাবার</div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <div><b>সকাল:</b> {fp.breakfast}</div>
                    <div><b>দুপুর:</b> {fp.lunch}</div>
                    <div><b>রাত:</b> {fp.dinner}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMS Modal */}
        {showSmsModal && (
          <InTourSmsModal
            tour={selectedTour}
            bookings={tourBookings}
            onClose={() => setShowSmsModal(false)}
            onSmsSentSuccess={onRefresh}
          />
        )}
      </div>
    );
  }

  // ALL TOURS LISTING VIEW
  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ট্যুর ম্যানেজমেন্ট (Tours)
          </h2>
          <p className="text-xs text-slate-500">
            আসন্ন ও চলমান ট্যুর শিডিউল, সিট বুকিং ট্র্যাকিং ও নতুন ট্যুর ক্রিয়েটর
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ট্যুর প্ল্যান তৈরি করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "সবগুলো" },
            { id: "running", label: "লাইভ চলমান" },
            { id: "published", label: "বুকিং চলছে" },
            { id: "completed", label: "সম্পন্ন" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? "bg-teal-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTour}
            onChange={(e) => setSearchTour(e.target.value)}
            placeholder="গন্তব্য বা নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-teal-600"
          />
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => {
          const tourBookings = bookings.filter((b) => b.tourId === tour.id);
          const bookedCount = tourBookings.reduce((sum, b) => sum + (b.personsCount || 1), 0);
          const collected = tourBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);

          return (
            <div
              key={tour.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 bg-slate-100">
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-900 shadow-xs">
                  {tour.batchName}
                </div>

                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xs ${
                  tour.status === "running" ? "bg-emerald-600 animate-pulse" : "bg-teal-900"
                }`}>
                  {tour.status === "running" ? "● লাইভ চলছে" : "বুকিং ওপেন"}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-bold text-teal-700">{tour.destination}</div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug line-clamp-1">
                    {tour.title}
                  </h3>
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{tour.startDate} হতে {tour.endDate} ({tour.durationDays} দিন {tour.durationNights} রাত)</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar of seats filled */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">সিট বুকিং:</span>
                    <span className="font-bold text-slate-900">
                      {bookedCount} / {tour.totalSeats} জন ({Math.round((bookedCount / tour.totalSeats) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (bookedCount / tour.totalSeats) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>জমা: ৳{collected.toLocaleString("en-US")}</span>
                    <span className="text-emerald-700 font-semibold">{Math.max(0, tour.totalSeats - bookedCount)}টি সিট খালি</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTour(tour)}
                    className="flex-1 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>ম্যানেজ ও বুকিংস</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenNewBookingForTour(tour)}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    title="বুকিং যুক্ত করুন"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 8-STEP TOUR CREATION WIZARD MODAL (matching Screenshots 14-19) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto space-y-6 border border-slate-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Tour Builder (ট্যুর ক্রিয়েটর)</h3>
                <p className="text-xs text-slate-500">Create schedule, pricing packages, food menu & budget analysis</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stepper + Form + Live Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Stepper Vertical Navigation Left */}
              <div className="lg:col-span-3 space-y-1 text-xs font-semibold">
                {[
                  { id: "basic", label: "১. বেসিক তথ্য (Basic)" },
                  { id: "schedule", label: "২. সময় ও সিট (Schedule)" },
                  { id: "media", label: "৩. ছবি ও কভার (Media)" },
                  { id: "packages", label: "৪. প্যাকেজ ও মূল্য (Packages)" },
                  { id: "transport", label: "৫. পরিবহন ও গাইড (Transport)" },
                  { id: "food", label: "৬. খাবারের মেন্যু (Food)" },
                  { id: "itinerary", label: "৭. ভ্রমণ সূচি (Itinerary)" },
                  { id: "budget", label: "৮. বাজেট ও হিসাব (Budget)" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setWizardStep(st.id as any)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all ${
                      wizardStep === st.id
                        ? "bg-teal-900 text-white font-bold shadow-xs"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Form Body Center */}
              <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm">
                {wizardStep === "basic" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold mb-1">ট্যুরের নাম (Title)</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. রাজশাহী টু সাজেক ও খাগড়াছড়ি ভ্রমণ"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">গন্তব্য (Destination)</label>
                      <input
                        type="text"
                        value={formDestination}
                        onChange={(e) => setFormDestination(e.target.value)}
                        placeholder="সাজেক / সিলেট"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">ব্যাচ নাম (Batch)</label>
                      <input
                        type="text"
                        value={formBatchName}
                        onChange={(e) => setFormBatchName(e.target.value)}
                        placeholder="১৬ অক্টোবর ব্যাচ"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                )}

                {wizardStep === "schedule" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold mb-1">যাত্রার তারিখ (Start Date)</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold mb-1">কত দিন (Days)</label>
                        <input
                          type="number"
                          value={formDays}
                          onChange={(e) => setFormDays(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">কত রাত (Nights)</label>
                        <input
                          type="number"
                          value={formNights}
                          onChange={(e) => setFormNights(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-teal-50 text-teal-900 rounded-xl font-medium text-xs">
                      ফেরার হিসাবকৃত তারিখ (Auto calculated): <b>{calculatedEndDate}</b>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">মোট সিট সংখ্যা</label>
                      <input
                        type="number"
                        value={formSeats}
                        onChange={(e) => setFormSeats(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                )}

                {wizardStep === "media" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold mb-1">কভার ইমেজ (Cover Image)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formCoverImage}
                          onChange={(e) => setFormCoverImage(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMediaPickerModal(true)}
                          className="px-3 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                        >
                          Choose photo
                        </button>
                      </div>
                    </div>
                    <div className="aspect-16/9 rounded-2xl overflow-hidden border">
                      <img src={formCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {wizardStep === "packages" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold mb-1">৪ জন ১ রুম শেয়ারিং প্যাকেজ মূল্য (জনপ্রতি)</label>
                      <input
                        type="number"
                        value={formSharedPrice}
                        onChange={(e) => {
                          setFormSharedPrice(Number(e.target.value));
                          setFormBasePrice(Number(e.target.value));
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">কাপল প্যাকেজ এসি রুম (২ জনের মোট বিল)</label>
                      <input
                        type="number"
                        value={formCouplePrice}
                        onChange={(e) => setFormCouplePrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">স্পট এন্ট্রি / বোট অ্যাড-অন ফি</label>
                      <input
                        type="number"
                        value={formAddonPrice}
                        onChange={(e) => setFormAddonPrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                )}

                {wizardStep === "transport" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold mb-1">পরিবহন ও বাস ধরণ</label>
                      <input
                        type="text"
                        value={formBusType}
                        onChange={(e) => setFormBusType(e.target.value)}
                        placeholder="নন-এসি চেয়ার কোচ + চান্দের গাড়ি"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">ট্যুর হোস্ট / গাইড নির্বাচন</label>
                      <select className="w-full p-2.5 rounded-xl border border-slate-300 bg-white">
                        <option>রাকিবুল ইসলাম (Senior Guide)</option>
                        <option>সাব্বির হোসেন (Tour Guide & Photo)</option>
                      </select>
                    </div>
                  </div>
                )}

                {wizardStep === "food" && (
                  <div className="space-y-2">
                    <div className="font-semibold text-xs text-slate-700">খাবার পরিকল্পনা:</div>
                    <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
                      <div><b>দিন ১ সকাল:</b> ডিম খিচুড়ি + বেগুন ভাজা + চা</div>
                      <div><b>দিন ১ দুপুর:</b> পাহাড়ি দেশি মুরগি + ডাল ভাত</div>
                      <div><b>দিন ১ রাত:</b> স্পেশাল ব্যাম্বু বিরিয়ানি</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
                      <div><b>দিন ২ সকাল:</b> ভূনা পরোটা + আলুর দম + চা</div>
                      <div><b>দিন ২ দুপুর:</b> সিস্টেম রেস্তোরাঁয় হাঁসের মাংস</div>
                    </div>
                  </div>
                )}

                {wizardStep === "itinerary" && (
                  <div className="space-y-2">
                    <div className="font-semibold text-xs text-slate-700">দিনভিত্তিক ভ্রমণ পরিকল্পনা:</div>
                    <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
                      <div className="font-bold text-teal-900">দিন ১: খাগড়াছড়ি হতে সাজেক ভ্যালি</div>
                      <p className="text-slate-600">হাজাছড়া ঝর্ণা, চাঁদের গাড়ি রাইড ও কংলাক পাহাড়ে সূর্যাস্ত।</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1">
                      <div className="font-bold text-teal-900">দিন ২: সূর্যোদয়, আলুটিলা গুহা ও ফিরতি যাত্রা</div>
                      <p className="text-slate-600">হেলিপ্যাড সূর্যোদয়, আলুটিলা গুহা ও রিসাং ঝর্ণা।</p>
                    </div>
                  </div>
                )}

                {wizardStep === "budget" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">বাস ভাড়া (৳)</label>
                        <input
                          type="number"
                          value={formBusCost}
                          onChange={(e) => setFormBusCost(Number(e.target.value))}
                          className="w-full p-2 rounded-xl border"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">হোটেল / রিসোর্ট (৳)</label>
                        <input
                          type="number"
                          value={formHotelCost}
                          onChange={(e) => setFormHotelCost(Number(e.target.value))}
                          className="w-full p-2 rounded-xl border"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">খাবার খরচ (৳)</label>
                        <input
                          type="number"
                          value={formFoodCost}
                          onChange={(e) => setFormFoodCost(Number(e.target.value))}
                          className="w-full p-2 rounded-xl border"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">গাইড অনারারিয়াম (৳)</label>
                        <input
                          type="number"
                          value={formGuideCost}
                          onChange={(e) => setFormGuideCost(Number(e.target.value))}
                          className="w-full p-2 rounded-xl border"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>সর্বমোট বাজেট:</span>
                        <span className="font-bold text-amber-400">৳{estTotalBudget.toLocaleString("en-US")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ব্রেক-ইভেন যাত্রী সংখ্যা:</span>
                        <span className="font-bold text-emerald-400">{breakEvenPersons} জন (লাভ নিশ্চিত করতে)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={handleCreateTourSubmit}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isCreating ? "সংরক্ষণ হচ্ছে..." : "ট্যুর প্রকাশ করুন (Publish Tour)"}</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Card Right matching Screenshots 14-19 */}
              <div className="lg:col-span-4 bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3 sticky top-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Live preview on website
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-3">
                  <div className="relative aspect-16/10">
                    <img src={formCoverImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {formBatchName}
                    </div>
                  </div>

                  <div className="p-3 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{formTitle}</div>
                    <div className="text-slate-500 text-[11px]">
                      📅 {formStartDate} • {formNights} রাত {formDays} দিন
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="font-black text-amber-600 text-sm">৳{formBasePrice} থেকে</div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {formSeats}টি সিট
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Media Picker Modal matching Screenshot 17 */}
      {showMediaPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Choose destination cover photo</h3>
              <button onClick={() => setShowMediaPickerModal(false)} className="text-slate-400">✕</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
              {STOCK_DESTINATION_PHOTOS.map((ph, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setFormCoverImage(ph.url);
                    setShowMediaPickerModal(false);
                  }}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 hover:border-teal-500 relative aspect-4/3"
                >
                  <img src={ph.url} alt={ph.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold text-center p-1">
                    {ph.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
