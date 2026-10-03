"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar, DashboardTab } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { OverviewView } from "@/components/dashboard/OverviewView";
import { ToursView } from "@/components/dashboard/ToursView";
import { InquiriesView } from "@/components/dashboard/InquiriesView";
import { CustomersView } from "@/components/dashboard/CustomersView";
import { SmsPanelView } from "@/components/dashboard/SmsPanelView";
import { FeedbackView } from "@/components/dashboard/FeedbackView";
import { AccountingView } from "@/components/dashboard/AccountingView";
import { MealMenusView } from "@/components/dashboard/MealMenusView";
import { NetworkContactsView } from "@/components/dashboard/NetworkContactsView";
import { WebsiteContentView } from "@/components/dashboard/WebsiteContentView";
import { TeamView } from "@/components/dashboard/TeamView";
import { AuditLogView } from "@/components/dashboard/AuditLogView";
import { InTourSmsModal } from "@/components/dashboard/InTourSmsModal";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";
import { ZipDownloadModal } from "@/components/dashboard/ZipDownloadModal";
import {
  INITIAL_TOURS,
  INITIAL_BOOKINGS,
  INITIAL_CUSTOMERS,
  INITIAL_INQUIRIES,
  INITIAL_SMS_LOGS,
  INITIAL_REVIEWS,
  INITIAL_MEAL_MENUS,
  INITIAL_NETWORK_CONTACTS,
  INITIAL_ACCOUNTING,
} from "@/data/initial-data";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<DashboardTab>("overview");

  // Data states
  const [tours, setTours] = useState<any[]>(INITIAL_TOURS);
  const [bookings, setBookings] = useState<any[]>(INITIAL_BOOKINGS);
  const [inquiries, setInquiries] = useState<any[]>(INITIAL_INQUIRIES);
  const [customers, setCustomers] = useState<any[]>(INITIAL_CUSTOMERS);
  const [customerStats, setCustomerStats] = useState<any>(null);
  const [smsLogs, setSmsLogs] = useState<any[]>(INITIAL_SMS_LOGS);
  const [reviews, setReviews] = useState<any[]>(INITIAL_REVIEWS);
  const [mealMenus, setMealMenus] = useState<any[]>(INITIAL_MEAL_MENUS);
  const [contacts, setContacts] = useState<any[]>(INITIAL_NETWORK_CONTACTS);
  const [accountingData, setAccountingData] = useState<any>({
    summary: { totalRevenue: 185000, totalExpenses: 112000, netProfit: 73000, totalDue: 18500, upcomingReceivable: 45000 },
    entries: INITIAL_ACCOUNTING,
  });
  const [loading, setLoading] = useState(false);

  // Modals state
  const [selectedTourForSms, setSelectedTourForSms] = useState<any | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [preselectedTourForBooking, setPreselectedTourForBooking] = useState<any | null>(null);
  const [preselectedInquiryForBooking, setPreselectedInquiryForBooking] = useState<any | null>(null);
  const [showZipModal, setShowZipModal] = useState(false);

  const fetchAllData = async () => {
    try {
      const [
        toursRes,
        bookingsRes,
        inquiriesRes,
        customersRes,
        smsRes,
        feedbackRes,
        mealsRes,
        contactsRes,
        accountingRes,
      ] = await Promise.all([
        fetch("/api/tours").then((r) => r.json()).catch(() => ({ tours: [] })),
        fetch("/api/bookings").then((r) => r.json()).catch(() => ({ bookings: [] })),
        fetch("/api/inquiries").then((r) => r.json()).catch(() => ({ inquiries: [] })),
        fetch("/api/customers").then((r) => r.json()).catch(() => ({ customers: [], stats: {} })),
        fetch("/api/sms").then((r) => r.json()).catch(() => ({ logs: [] })),
        fetch("/api/feedback").then((r) => r.json()).catch(() => ({ reviews: [] })),
        fetch("/api/meal-menus").then((r) => r.json()).catch(() => ({ menus: [] })),
        fetch("/api/network-contacts").then((r) => r.json()).catch(() => ({ contacts: [] })),
        fetch("/api/accounting").then((r) => r.json()).catch(() => ({ summary: {}, entries: [] })),
      ]);

      if (toursRes.tours) setTours(toursRes.tours);
      if (bookingsRes.bookings) setBookings(bookingsRes.bookings);
      if (inquiriesRes.inquiries) setInquiries(inquiriesRes.inquiries);
      if (customersRes.customers) setCustomers(customersRes.customers);
      if (customersRes.stats) setCustomerStats(customersRes.stats);
      if (smsRes.logs) setSmsLogs(smsRes.logs);
      if (feedbackRes.reviews) setReviews(feedbackRes.reviews);
      if (mealsRes.menus) setMealMenus(mealsRes.menus);
      if (contactsRes.contacts) setContacts(contactsRes.contacts);
      if (accountingRes.summary) setAccountingData(accountingRes);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenNewBooking = (tour?: any) => {
    setPreselectedTourForBooking(tour || null);
    setPreselectedInquiryForBooking(null);
    setShowNewBookingModal(true);
  };

  const handleConvertInquiryToBooking = (inquiry: any) => {
    setPreselectedInquiryForBooking(inquiry);
    const matchedTour = tours.find((t) => t.id === inquiry.tourId) || tours[0];
    setPreselectedTourForBooking(matchedTour);
    setShowNewBookingModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      
      {/* Sidebar matching screenshots */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        inquiriesCount={inquiries.filter((i) => i.status === "new").length}
        onOpenZipModal={() => setShowZipModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onOpenZipModal={() => setShowZipModal(true)} />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === "overview" && (
              <OverviewView
                tours={tours}
                inquiries={inquiries}
                bookings={bookings}
                customersCount={customers.length}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenNewTour={() => setCurrentTab("tours")}
                onOpenNewBooking={() => handleOpenNewBooking()}
                onSelectTourForSms={(tour) => setSelectedTourForSms(tour)}
              />
            )}

            {currentTab === "tours" && (
              <ToursView
                tours={tours}
                bookings={bookings}
                smsLogs={smsLogs}
                onRefresh={fetchAllData}
                onOpenNewBookingForTour={(tour) => handleOpenNewBooking(tour)}
              />
            )}

            {currentTab === "inquiries" && (
              <InquiriesView
                inquiries={inquiries}
                onRefresh={fetchAllData}
                onConvertToBooking={handleConvertInquiryToBooking}
              />
            )}

            {currentTab === "customers" && (
              <CustomersView
                customers={customers}
                stats={customerStats}
                onRefresh={fetchAllData}
                onOpenAddCustomer={() => {}}
              />
            )}

            {currentTab === "sms" && (
              <SmsPanelView
                logs={smsLogs}
                customers={customers}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === "feedback" && (
              <FeedbackView
                reviews={reviews}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === "accounting" && (
              <AccountingView
                entries={accountingData?.entries || []}
                summary={accountingData?.summary}
                comparison={accountingData?.comparison}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === "meal_menus" && (
              <MealMenusView
                menus={mealMenus}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === "network_contacts" && (
              <NetworkContactsView
                contacts={contacts}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === "website_content" && (
              <WebsiteContentView />
            )}

            {currentTab === "team" && (
              <TeamView />
            )}

            {currentTab === "audit_log" && (
              <AuditLogView />
            )}
          </div>
        </main>
      </div>

      {/* Global In-Tour SMS Broadcast Modal */}
      {selectedTourForSms && (
        <InTourSmsModal
          tour={selectedTourForSms}
          bookings={bookings.filter((b) => b.tourId === selectedTourForSms.id)}
          onClose={() => setSelectedTourForSms(null)}
          onSmsSentSuccess={fetchAllData}
        />
      )}

      {/* Global New Booking Modal */}
      {showNewBookingModal && (
        <NewBookingModal
          tours={tours}
          customers={customers}
          preselectedTour={preselectedTourForBooking}
          preselectedInquiry={preselectedInquiryForBooking}
          onClose={() => setShowNewBookingModal(false)}
          onBookingSuccess={fetchAllData}
        />
      )}

      {/* Full Project ZIP Download Modal */}
      {showZipModal && (
        <ZipDownloadModal onClose={() => setShowZipModal(false)} />
      )}

    </div>
  );
}
