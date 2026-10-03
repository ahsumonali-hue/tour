export function safeJsonParse<T = any>(val: any, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "object") return val as T;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return (parsed ?? fallback) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function parseTourJson(tour: any) {
  if (!tour) return tour;
  return {
    ...tour,
    galleryImages: safeJsonParse(tour.galleryImages, []),
    highlights: safeJsonParse(tour.highlights, []),
    inclusions: safeJsonParse(tour.inclusions, []),
    exclusions: safeJsonParse(tour.exclusions, []),
    assignedGuideIds: safeJsonParse(tour.assignedGuideIds, []),
    foodPlan: safeJsonParse(tour.foodPlan, []),
    itinerary: safeJsonParse(tour.itinerary, []),
    budgetData: safeJsonParse(tour.budgetData, null),
  };
}

export function parseReviewJson(review: any) {
  if (!review) return review;
  return {
    ...review,
    likedFeatures: safeJsonParse(review.likedFeatures, []),
  };
}

export function parseCustomerJson(customer: any) {
  if (!customer) return customer;
  return {
    ...customer,
    tags: safeJsonParse(customer.tags, []),
  };
}

export function parseInquiryJson(inquiry: any) {
  if (!inquiry) return inquiry;
  return {
    ...inquiry,
    followUps: safeJsonParse(inquiry.followUps, []),
  };
}

export function parseSmsLogJson(log: any) {
  if (!log) return log;
  return {
    ...log,
    recipientPhones: safeJsonParse(log.recipientPhones, []),
  };
}
