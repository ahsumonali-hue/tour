import { pool } from "@/db";
import { seedDatabase } from "@/db/seed";

let isInitialized = false;

export async function ensureDbInitialized() {
  if (isInitialized) return;

  const tableQueries = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL DEFAULT '123456',
      role VARCHAR(64) NOT NULL,
      avatar TEXT,
      title VARCHAR(255),
      status VARCHAR(64) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tours (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      destination VARCHAR(255) NOT NULL,
      batch_name VARCHAR(255) NOT NULL,
      start_date VARCHAR(64) NOT NULL,
      end_date VARCHAR(64) NOT NULL,
      duration_days INT NOT NULL DEFAULT 2,
      duration_nights INT NOT NULL DEFAULT 3,
      departure_from VARCHAR(255) NOT NULL DEFAULT 'ভদ্রা মোড় / রেলগেট, রাজশাহী',
      total_seats INT NOT NULL DEFAULT 40,
      available_seats INT NOT NULL DEFAULT 40,
      base_price INT NOT NULL DEFAULT 4800,
      status VARCHAR(64) NOT NULL DEFAULT 'published',
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      cover_image TEXT NOT NULL,
      poster_image TEXT,
      gallery_images JSON,
      description TEXT NOT NULL,
      highlights JSON,
      inclusions JSON,
      exclusions JSON,
      assigned_guide_ids JSON,
      bus_type VARCHAR(255) NOT NULL DEFAULT 'নন-এসি চেয়ার কোচ + চান্দের গাড়ি',
      food_plan JSON,
      itinerary JSON,
      budget_data JSON,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tour_packages (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      tour_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      room_type VARCHAR(100) NOT NULL,
      price_per_person INT NOT NULL,
      description TEXT,
      is_default BOOLEAN DEFAULT FALSE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tour_addons (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      tour_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS customers (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL UNIQUE,
      email VARCHAR(191),
      district VARCHAR(100) NOT NULL DEFAULT 'Rajshahi',
      address TEXT,
      tags JSON,
      total_trips INT NOT NULL DEFAULT 0,
      total_spent INT NOT NULL DEFAULT 0,
      current_due INT NOT NULL DEFAULT 0,
      last_trip_name VARCHAR(255),
      last_trip_date VARCHAR(64),
      next_trip_name VARCHAR(255),
      next_trip_date VARCHAR(64),
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS bookings (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      booking_code VARCHAR(64) NOT NULL UNIQUE,
      tour_id VARCHAR(64) NOT NULL,
      customer_id INT,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(32) NOT NULL,
      package_id INT,
      package_name VARCHAR(255) NOT NULL,
      persons_count INT NOT NULL DEFAULT 1,
      seat_numbers VARCHAR(255) DEFAULT '',
      base_amount INT NOT NULL,
      addons_amount INT NOT NULL DEFAULT 0,
      discount_amount INT NOT NULL DEFAULT 0,
      total_amount INT NOT NULL,
      paid_amount INT NOT NULL DEFAULT 0,
      due_amount INT NOT NULL DEFAULT 0,
      payment_method VARCHAR(64) NOT NULL DEFAULT 'bKash',
      booking_source VARCHAR(64) NOT NULL DEFAULT 'Phone Call',
      status VARCHAR(64) NOT NULL DEFAULT 'confirmed',
      pickup_point VARCHAR(255) NOT NULL DEFAULT 'ভদ্রা মোড়, রাজশাহী',
      notes TEXT,
      created_by VARCHAR(255) DEFAULT 'Tanvir Ahmed',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS inquiries (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      inquiry_code VARCHAR(64) NOT NULL UNIQUE,
      customer_name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      tour_id VARCHAR(64),
      tour_title VARCHAR(255) NOT NULL,
      persons_count INT NOT NULL DEFAULT 1,
      preferred_package VARCHAR(255),
      message TEXT,
      status VARCHAR(64) NOT NULL DEFAULT 'new',
      assigned_to VARCHAR(255) DEFAULT 'Tanvir Ahmed',
      source VARCHAR(64) NOT NULL DEFAULT 'website',
      follow_ups JSON,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS sms_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      tour_id VARCHAR(64),
      sender_name VARCHAR(255) NOT NULL,
      sms_type VARCHAR(64) NOT NULL,
      template_title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      recipient_count INT NOT NULL DEFAULT 1,
      recipient_phones JSON,
      delivery_status VARCHAR(64) NOT NULL DEFAULT 'Delivered',
      cost FLOAT NOT NULL DEFAULT 0.45,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS feedback_reviews (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      tour_id VARCHAR(64),
      tour_title VARCHAR(255) NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(32),
      rating INT NOT NULL DEFAULT 5,
      liked_features JSON,
      review_text TEXT NOT NULL,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      traveler_type VARCHAR(64) DEFAULT 'Group',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS meal_menus (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      meal_type VARCHAR(64) NOT NULL,
      cost_per_person INT NOT NULL,
      description TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS network_contacts (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      contact_person VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      district VARCHAR(100) NOT NULL,
      category VARCHAR(64) NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      notes TEXT,
      last_used_date VARCHAR(64),
      linked_tours_count INT DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS accounting_entries (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      month_year VARCHAR(32) NOT NULL,
      tour_id VARCHAR(64),
      entry_type VARCHAR(64) NOT NULL,
      category VARCHAR(64) NOT NULL,
      amount INT NOT NULL,
      description TEXT NOT NULL,
      entry_date VARCHAR(64) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS website_settings (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`key\` VARCHAR(191) NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      user_role VARCHAR(64) NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  ];

  try {
    for (const query of tableQueries) {
      await pool.query(query);
    }

    isInitialized = true;
    await seedDatabase();
  } catch (error) {
    console.error("Error creating MySQL tables / seeding:", error);
  }
}
