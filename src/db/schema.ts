import { mysqlTable, serial, text, varchar, int, boolean, timestamp, json, float } from "drizzle-orm/mysql-core";

// 1. Staff and Team members
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(), // e.g. 'usr-1', 'usr-2'
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull().default("123456"),
  role: varchar("role", { length: 64 }).notNull(), // 'owner' | 'admin' | 'tour_guide' | 'accountant' | 'staff'
  avatar: text("avatar"),
  title: varchar("title", { length: 255 }), // e.g. 'Founder & CEO', 'Senior Guide'
  status: varchar("status", { length: 64 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Tours
export const tours = mysqlTable("tours", {
  id: varchar("id", { length: 64 }).primaryKey(), // e.g. 't-sajek-oct', 't-sylhet-oct'
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  destination: varchar("destination", { length: 255 }).notNull(),
  batchName: varchar("batch_name", { length: 255 }).notNull(),
  startDate: varchar("start_date", { length: 64 }).notNull(),
  endDate: varchar("end_date", { length: 64 }).notNull(),
  durationDays: int("duration_days").notNull().default(2),
  durationNights: int("duration_nights").notNull().default(3),
  departureFrom: varchar("departure_from", { length: 255 }).notNull().default("ভদ্রা মোড় / রেলগেট, রাজশাহী"),
  totalSeats: int("total_seats").notNull().default(40),
  availableSeats: int("available_seats").notNull().default(40),
  basePrice: int("base_price").notNull().default(4800),
  status: varchar("status", { length: 64 }).notNull().default("published"), // 'published' | 'draft' | 'running' | 'completed' | 'cancelled'
  isFeatured: boolean("is_featured").notNull().default(false),
  coverImage: text("cover_image").notNull(),
  posterImage: text("poster_image"),
  galleryImages: json("gallery_images").$type<string[]>().default([]),
  description: text("description").notNull(),
  highlights: json("highlights").$type<string[]>().default([]),
  inclusions: json("inclusions").$type<string[]>().default([]),
  exclusions: json("exclusions").$type<string[]>().default([]),
  assignedGuideIds: json("assigned_guide_ids").$type<string[]>().default([]),
  busType: varchar("bus_type", { length: 255 }).notNull().default("নন-এসি চেয়ার কোচ + চান্দের গাড়ি"),
  foodPlan: json("food_plan").$type<Array<{
    day: number;
    breakfast?: string;
    lunch?: string;
    snacks?: string;
    dinner?: string;
  }>>().default([]),
  itinerary: json("itinerary").$type<Array<{
    day: number;
    title: string;
    description: string;
    spots?: string[];
  }>>().default([]),
  budgetData: json("budget_data").$type<{
    busCost: number;
    hotelCost: number;
    foodCost: number;
    guideFee: number;
    ticketsCost: number;
    otherCost: number;
    estTotalCost: number;
    estMinPersons: number;
    breakEvenPersons: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Tour Packages (e.g. Couple AC, Non-AC 4 in 1)
export const tourPackages = mysqlTable("tour_packages", {
  id: serial("id").primaryKey(),
  tourId: varchar("tour_id", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  roomType: varchar("room_type", { length: 100 }).notNull(),
  pricePerPerson: int("price_per_person").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
});

// 4. Tour Addons (e.g. entry tickets, boat ride)
export const tourAddons = mysqlTable("tour_addons", {
  id: serial("id").primaryKey(),
  tourId: varchar("tour_id", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(),
});

// 5. Customers
export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 191 }),
  district: varchar("district", { length: 100 }).notNull().default("Rajshahi"),
  address: text("address"),
  tags: json("tags").$type<string[]>().default([]), // ['Loyal', 'Group leader', 'Couple', 'Repeat']
  totalTrips: int("total_trips").notNull().default(0),
  totalSpent: int("total_spent").notNull().default(0),
  currentDue: int("current_due").notNull().default(0),
  lastTripName: varchar("last_trip_name", { length: 255 }),
  lastTripDate: varchar("last_trip_date", { length: 64 }),
  nextTripName: varchar("next_trip_name", { length: 255 }),
  nextTripDate: varchar("next_trip_date", { length: 64 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Bookings
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  bookingCode: varchar("booking_code", { length: 64 }).notNull().unique(), // e.g. RTT-2610-008
  tourId: varchar("tour_id", { length: 64 }).notNull(),
  customerId: int("customer_id"),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 32 }).notNull(),
  packageId: int("package_id"),
  packageName: varchar("package_name", { length: 255 }).notNull(),
  personsCount: int("persons_count").notNull().default(1),
  seatNumbers: varchar("seat_numbers", { length: 255 }).default(""),
  baseAmount: int("base_amount").notNull(),
  addonsAmount: int("addons_amount").notNull().default(0),
  discountAmount: int("discount_amount").notNull().default(0),
  totalAmount: int("total_amount").notNull(),
  paidAmount: int("paid_amount").notNull().default(0),
  dueAmount: int("due_amount").notNull().default(0),
  paymentMethod: varchar("payment_method", { length: 64 }).notNull().default("bKash"), // 'bKash' | 'Nagad' | 'Cash' | 'Bank'
  bookingSource: varchar("booking_source", { length: 64 }).notNull().default("Phone Call"), // 'Phone Call' | 'Website' | 'Facebook' | 'WhatsApp'
  status: varchar("status", { length: 64 }).notNull().default("confirmed"), // 'confirmed' | 'pending' | 'cancelled' | 'completed'
  pickupPoint: varchar("pickup_point", { length: 255 }).notNull().default("ভদ্রা মোড়, রাজশাহী"),
  notes: text("notes"),
  createdBy: varchar("created_by", { length: 255 }).default("Tanvir Ahmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Inquiries / Leads (Kanban)
export const inquiries = mysqlTable("inquiries", {
  id: serial("id").primaryKey(),
  inquiryCode: varchar("inquiry_code", { length: 64 }).notNull().unique(), // e.g. iq-18
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  tourId: varchar("tour_id", { length: 64 }),
  tourTitle: varchar("tour_title", { length: 255 }).notNull(),
  personsCount: int("persons_count").notNull().default(1),
  preferredPackage: varchar("preferred_package", { length: 255 }),
  message: text("message"),
  status: varchar("status", { length: 64 }).notNull().default("new"), // 'new' | 'contacted' | 'converted' | 'not_interested'
  assignedTo: varchar("assigned_to", { length: 255 }).default("Tanvir Ahmed"),
  source: varchar("source", { length: 64 }).notNull().default("website"),
  followUps: json("follow_ups").$type<Array<{
    id: string;
    note: string;
    author: string;
    date: string;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. SMS Logs
export const smsLogs = mysqlTable("sms_logs", {
  id: serial("id").primaryKey(),
  tourId: varchar("tour_id", { length: 64 }),
  senderName: varchar("sender_name", { length: 255 }).notNull(),
  smsType: varchar("sms_type", { length: 64 }).notNull(), // 'tour_broadcast' | 'booking_confirm' | 'marketing' | 'due_reminder' | 'feedback_link'
  templateTitle: varchar("template_title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  recipientCount: int("recipient_count").notNull().default(1),
  recipientPhones: json("recipient_phones").$type<string[]>().default([]),
  deliveryStatus: varchar("delivery_status", { length: 64 }).notNull().default("Delivered"),
  cost: float("cost").notNull().default(0.45),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Feedback & Reviews
export const feedbackReviews = mysqlTable("feedback_reviews", {
  id: serial("id").primaryKey(),
  tourId: varchar("tour_id", { length: 64 }),
  tourTitle: varchar("tour_title", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 32 }),
  rating: int("rating").notNull().default(5),
  likedFeatures: json("liked_features").$type<string[]>().default([]), // ['খাবার দারুণ', 'গাইড আন্তরিক', 'বাস সুন্দর']
  reviewText: text("review_text").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  travelerType: varchar("traveler_type", { length: 64 }).default("Group"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Meal Menus Template Database
export const mealMenus = mysqlTable("meal_menus", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  mealType: varchar("meal_type", { length: 64 }).notNull(), // 'breakfast' | 'lunch' | 'snacks' | 'dinner'
  costPerPerson: int("cost_per_person").notNull(),
  description: text("description"),
});

// 11. Network Contacts (Ground Partners)
export const networkContacts = mysqlTable("network_contacts", {
  id: serial("id").primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(), // 'hotel' | 'resort' | 'bus_transport' | 'jeep_chander_gari' | 'boat_launch' | 'restaurant' | 'local_guide'
  rating: int("rating").notNull().default(5),
  notes: text("notes"),
  lastUsedDate: varchar("last_used_date", { length: 64 }),
  linkedToursCount: int("linked_tours_count").default(1),
});

// 12. Accounting & Expenses
export const accountingEntries = mysqlTable("accounting_entries", {
  id: serial("id").primaryKey(),
  monthYear: varchar("month_year", { length: 32 }).notNull(), // e.g. '2026-10'
  tourId: varchar("tour_id", { length: 64 }),
  entryType: varchar("entry_type", { length: 64 }).notNull(), // 'income' | 'tour_expense' | 'overhead_expense' | 'marketing_expense'
  category: varchar("category", { length: 64 }).notNull(), // 'tour_revenue' | 'bus' | 'hotel' | 'food' | 'guide' | 'boat' | 'tickets' | 'office_rent' | 'wifi' | 'marketing'
  amount: int("amount").notNull(),
  description: text("description").notNull(),
  entryDate: varchar("entry_date", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Website Settings & Content
export const websiteSettings = mysqlTable("website_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 191 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 14. Audit Logs
export const auditLogs = mysqlTable("audit_logs", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userRole: varchar("user_role", { length: 64 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
