-- ============================================================
-- TRAVELOOP — Complete Database Schema
-- ============================================================
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO';

CREATE DATABASE IF NOT EXISTS traveloop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traveloop;

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  language_pref VARCHAR(10) DEFAULT 'en',
  is_admin TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  UNIQUE KEY uq_email (email)
);

-- ─── CITIES ──────────────────────────────────────────────────
CREATE TABLE cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  avg_daily_cost_usd DECIMAL(8,2) DEFAULT 0.00,
  popularity_score TINYINT DEFAULT 5,
  timezone VARCHAR(50),
  CONSTRAINT chk_popularity CHECK (popularity_score BETWEEN 1 AND 10),
  UNIQUE KEY uq_city_country (name, country),
  INDEX idx_country (country),
  INDEX idx_popularity (popularity_score)
);

-- ─── ACTIVITIES ───────────────────────────────────────────────
CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  category ENUM('sightseeing','food','adventure','culture','shopping','wellness') NOT NULL,
  estimated_cost_usd DECIMAL(8,2) DEFAULT 0.00,
  duration_hours DECIMAL(4,1),
  description TEXT,
  image_url TEXT,
  tags JSON,
  CONSTRAINT chk_cost CHECK (estimated_cost_usd >= 0),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  INDEX idx_city_category (city_id, category)
);

-- ─── TRIPS ───────────────────────────────────────────────────
CREATE TABLE trips (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget DECIMAL(10,2) DEFAULT 0.00,
  computed_spent DECIMAL(10,2) DEFAULT 0.00,
  computed_activity_cost DECIMAL(10,2) DEFAULT 0.00,
  is_public TINYINT(1) DEFAULT 0,
  share_token CHAR(36) DEFAULT (UUID()),
  status ENUM('draft','planned','ongoing','completed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT chk_dates CHECK (end_date >= start_date),
  CONSTRAINT chk_budget CHECK (total_budget >= 0),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_share_token (share_token),
  INDEX idx_user_status (user_id, status)
);

-- ─── TRIP STOPS ───────────────────────────────────────────────
CREATE TABLE trip_stops (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  trip_id CHAR(36) NOT NULL,
  city_id INT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  stop_order TINYINT NOT NULL,
  notes TEXT,
  CONSTRAINT chk_stop_dates CHECK (departure_date >= arrival_date),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id),
  UNIQUE KEY uq_stop_order (trip_id, stop_order),
  INDEX idx_trip_stops (trip_id)
);

-- ─── TRIP ACTIVITIES ──────────────────────────────────────────
CREATE TABLE trip_activities (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  trip_stop_id CHAR(36) NOT NULL,
  activity_id INT NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  actual_cost_override DECIMAL(8,2) NULL,
  is_confirmed TINYINT(1) DEFAULT 0,
  CONSTRAINT chk_override_cost CHECK (actual_cost_override IS NULL OR actual_cost_override >= 0),
  FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  UNIQUE KEY uq_stop_activity_date (trip_stop_id, activity_id, scheduled_date),
  INDEX idx_trip_stop (trip_stop_id)
);

-- ─── BUDGET ENTRIES ───────────────────────────────────────────
CREATE TABLE budget_entries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  trip_id CHAR(36) NOT NULL,
  category ENUM('transport','accommodation','food','activities','misc') NOT NULL,
  label VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  entry_date DATE,
  is_estimated TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_amount CHECK (amount > 0),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  INDEX idx_trip_category (trip_id, category)
);

-- ─── PACKING ITEMS ────────────────────────────────────────────
CREATE TABLE packing_items (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  trip_id CHAR(36) NOT NULL,
  label VARCHAR(200) NOT NULL,
  category ENUM('clothing','documents','electronics','toiletries','misc') NOT NULL,
  is_packed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  INDEX idx_trip_packing (trip_id, category)
);

-- ─── TRIP NOTES ───────────────────────────────────────────────
CREATE TABLE trip_notes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  trip_id CHAR(36) NOT NULL,
  stop_id CHAR(36) NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (stop_id) REFERENCES trip_stops(id) ON DELETE SET NULL,
  INDEX idx_trip_notes (trip_id)
);

-- ─── REFRESH TOKENS ───────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_token (user_id)
);

-- ============================================================
-- TRIGGERS
-- ============================================================
DELIMITER $$

CREATE TRIGGER after_budget_entry_insert
AFTER INSERT ON budget_entries FOR EACH ROW
BEGIN
  UPDATE trips SET computed_spent = (
    SELECT COALESCE(SUM(amount), 0) FROM budget_entries WHERE trip_id = NEW.trip_id
  ) WHERE id = NEW.trip_id;
END$$

CREATE TRIGGER after_budget_entry_update
AFTER UPDATE ON budget_entries FOR EACH ROW
BEGIN
  UPDATE trips SET computed_spent = (
    SELECT COALESCE(SUM(amount), 0) FROM budget_entries WHERE trip_id = NEW.trip_id
  ) WHERE id = NEW.trip_id;
END$$

CREATE TRIGGER after_budget_entry_delete
AFTER DELETE ON budget_entries FOR EACH ROW
BEGIN
  UPDATE trips SET computed_spent = (
    SELECT COALESCE(SUM(amount), 0) FROM budget_entries WHERE trip_id = OLD.trip_id
  ) WHERE id = OLD.trip_id;
END$$

CREATE TRIGGER after_trip_activity_insert
AFTER INSERT ON trip_activities FOR EACH ROW
BEGIN
  UPDATE trips t
  INNER JOIN trip_stops ts ON ts.trip_id = t.id AND ts.id = NEW.trip_stop_id
  SET t.computed_activity_cost = (
    SELECT COALESCE(SUM(COALESCE(ta.actual_cost_override, a.estimated_cost_usd)), 0)
    FROM trip_activities ta
    JOIN activities a ON a.id = ta.activity_id
    JOIN trip_stops ts2 ON ts2.id = ta.trip_stop_id
    WHERE ts2.trip_id = t.id
  );
END$$

CREATE TRIGGER after_trip_activity_delete
AFTER DELETE ON trip_activities FOR EACH ROW
BEGIN
  UPDATE trips t
  INNER JOIN trip_stops ts ON ts.trip_id = t.id AND ts.id = OLD.trip_stop_id
  SET t.computed_activity_cost = (
    SELECT COALESCE(SUM(COALESCE(ta.actual_cost_override, a.estimated_cost_usd)), 0)
    FROM trip_activities ta
    JOIN activities a ON a.id = ta.activity_id
    JOIN trip_stops ts2 ON ts2.id = ta.trip_stop_id
    WHERE ts2.trip_id = t.id
  );
END$$

DELIMITER ;

-- ============================================================
-- VIEW: trip_cost_summary
-- ============================================================
CREATE VIEW trip_cost_summary AS
SELECT
  t.id AS trip_id,
  t.title,
  t.total_budget,
  t.computed_spent,
  t.computed_activity_cost,
  (t.computed_spent + t.computed_activity_cost) AS total_estimated_cost,
  ROUND(((t.computed_spent + t.computed_activity_cost) / NULLIF(t.total_budget, 0)) * 100, 1) AS budget_used_pct,
  CASE
    WHEN t.total_budget = 0 THEN 'unset'
    WHEN ((t.computed_spent + t.computed_activity_cost) / t.total_budget) > 1.0 THEN 'over'
    WHEN ((t.computed_spent + t.computed_activity_cost) / t.total_budget) > 0.8 THEN 'warning'
    ELSE 'healthy'
  END AS budget_status,
  DATEDIFF(t.end_date, t.start_date) + 1 AS trip_duration_days
FROM trips t
WHERE t.deleted_at IS NULL;
