"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { UpcomingTours } from "@/components/public/UpcomingTours";
import { TourDetailModal } from "@/components/public/TourDetailModal";
import { PastMemoriesSection } from "@/components/public/PastMemoriesSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { VideoReelsSection } from "@/components/public/VideoReelsSection";
import { GallerySection } from "@/components/public/GallerySection";
import { BookingStepsSection } from "@/components/public/BookingStepsSection";
import { NextTourCtaBanner } from "@/components/public/NextTourCtaBanner";
import { WhyChooseUs } from "@/components/public/WhyChooseUs";
import { OfficeMapSection } from "@/components/public/OfficeMapSection";
import { Footer } from "@/components/public/Footer";
import { ZipDownloadModal } from "@/components/dashboard/ZipDownloadModal";
import { INITIAL_TOURS, INITIAL_REVIEWS } from "@/data/initial-data";

export default function PublicLandingPage() {
  const [tours, setTours] = useState<any[]>(INITIAL_TOURS);
  const [reviews, setReviews] = useState<any[]>(INITIAL_REVIEWS);
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [showZipModal, setShowZipModal] = useState(false);

  useEffect(() => {
    // Fetch tours
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => {
        if (data.tours && data.tours.length > 0) {
          setTours(data.tours);
        }
      })
      .catch(() => {});

    // Fetch reviews
    fetch("/api/feedback?published=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const featuredTour = tours.find((t) => t.isFeatured) || tours[0];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* 1. Top Navbar */}
      <Navbar onOpenZipModal={() => setShowZipModal(true)} />

      {/* 2. Hero Section */}
      <Hero
        featuredTour={featuredTour}
        onSelectFeaturedTour={() => setSelectedTour(featuredTour)}
      />

      {/* 3. Upcoming Tours Grid ("আসন্ন ট্যুর সমূহ") */}
      <UpcomingTours
        tours={tours}
        onSelectTour={(t) => setSelectedTour(t)}
      />

      {/* 4. Past Tour Memories ("মেঘের রাজ্যে আমরা — একনজর স্মৃতি") */}
      <PastMemoriesSection onSelectMemoryTour={(t) => setSelectedTour(featuredTour)} />

      {/* 5. Traveler Testimonials & Reviews */}
      <TestimonialsSection reviews={reviews} />

      {/* 6. Video Reels Section */}
      <VideoReelsSection />

      {/* 7. Photo Gallery Grid */}
      <GallerySection />

      {/* 8. 4 Simple Booking Steps */}
      <BookingStepsSection />

      {/* 9. Next Tour Call to Action Banner */}
      <NextTourCtaBanner />

      {/* 10. Why Choose Us Trust Section */}
      <WhyChooseUs />

      {/* 11. Office Location & Map Section */}
      <OfficeMapSection />

      {/* 12. Footer */}
      <Footer />

      {/* Tour Detail & Booking Modal */}
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}

      {/* Full Project ZIP Download Modal */}
      {showZipModal && (
        <ZipDownloadModal onClose={() => setShowZipModal(false)} />
      )}
    </div>
  );
}
