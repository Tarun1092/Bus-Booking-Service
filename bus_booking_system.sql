drop database bus_booking_system;
CREATE DATABASE bus_booking_system;

USE bus_booking_system;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buses table
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    bus_name VARCHAR(100) NOT NULL,
    source_city VARCHAR(50) NOT NULL,
    destination_city VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    bus_type ENUM('AC', 'Non-AC', 'Sleeper') DEFAULT 'Non-AC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    seat_numbers VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    journey_date DATE NOT NULL,
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    pnr_number VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO
    users (
        name,
        email,
        phone,
        password,
        role
    )
VALUES (
        'Admin User',
        'admin@bus.com',
        '9876543210',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'admin'
    ),
    (
        'John Doe',
        'john@example.com',
        '9876543211',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'user'
    ),
    (
        'Jane Smith',
        'jane@example.com',
        '9876543212',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'user'
    );

-- Insert sample buses with Indian states and future dates
-- Insert comprehensive bus records covering major Indian routes
INSERT INTO buses (bus_number, bus_name, source_city, destination_city, departure_time, arrival_time, total_seats, available_seats, fare, bus_type) VALUES
-- Delhi Routes
('DL01AC', 'Delhi Travels AC', 'Delhi', 'Jaipur', '2025-11-12 08:00:00', '2025-11-12 14:00:00', 40, 40, 1200.00, 'AC'),
('DL02SL', 'Delhi Sleeper Express', 'Delhi', 'Jaipur', '2025-11-12 22:00:00', '2025-11-13 04:00:00', 35, 35, 900.00, 'Sleeper'),
('DL03NA', 'Delhi Roadways', 'Delhi', 'Jaipur', '2025-11-13 06:30:00', '2025-11-13 12:30:00', 45, 45, 600.00, 'Non-AC'),

('DL04AC', 'Delhi Luxury', 'Delhi', 'Chandigarh', '2025-11-13 07:00:00', '2025-11-13 11:30:00', 30, 30, 800.00, 'AC'),
('DL05SL', 'Himachal Express', 'Delhi', 'Shimla', '2025-11-14 21:00:00', '2025-11-11 06:00:00', 32, 32, 1500.00, 'Sleeper'),
('DL06NA', 'Delhi Uttarakhand', 'Delhi', 'Dehradun', '2025-11-12 08:30:00', '2025-11-12 16:00:00', 40, 40, 1100.00, 'Non-AC'),

-- Mumbai Routes
('MB01AC', 'Mumbai Luxury', 'Mumbai', 'Pune', '2025-11-13 07:30:00', '2025-11-13 11:30:00', 35, 35, 850.00, 'AC'),
('MB02SL', 'Maharashtra Sleeper', 'Mumbai', 'Pune', '2025-11-13 22:00:00', '2025-11-13 04:00:00', 30, 30, 800.00, 'Sleeper'),
('MB03NA', 'Mumbai Express', 'Mumbai', 'Pune', '2025-11-13 06:00:00', '2025-11-13 10:30:00', 50, 50, 500.00, 'Non-AC'),

('MB04AC', 'Konkan Travels', 'Mumbai', 'Goa', '2025-11-12 20:00:00', '2025-11-13 08:00:00', 28, 28, 1800.00, 'AC'),
('MB05SL', 'Goa Sleeper', 'Mumbai', 'Goa', '2025-11-13 21:30:00', '2025-11-14 09:30:00', 32, 32, 1200.00, 'Sleeper'),
('MB06NA', 'Coastal Express', 'Mumbai', 'Goa', '2025-11-14 08:00:00', '2025-11-14 20:00:00', 45, 45, 900.00, 'Non-AC'),

-- Bangalore Routes
('BL01AC', 'Bangalore Luxury', 'Bangalore', 'Mysore', '2025-11-14 06:30:00', '2025-11-14 11:00:00', 35, 35, 450.00, 'AC'),
('BL02SL', 'Karnataka Sleeper', 'Bangalore', 'Mysore', '2025-11-14 22:00:00', '2025-11-11 03:00:00', 30, 30, 350.00, 'Sleeper'),
('BL03NA', 'Karnataka Express', 'Bangalore', 'Mysore', '2025-11-11 07:00:00', '2025-11-11 11:30:00', 45, 45, 250.00, 'Non-AC'),

('BL04AC', 'Tech City Express', 'Bangalore', 'Chennai', '2025-11-15 08:00:00', '2025-11-15 15:00:00', 40, 40, 1200.00, 'AC'),
('BL05SL', 'Southern Sleeper', 'Bangalore', 'Chennai', '2025-11-16 21:00:00', '2025-11-17 04:00:00', 35, 35, 900.00, 'Sleeper'),
('BL06NA', 'Coromandel Express', 'Bangalore', 'Chennai', '2025-11-17 06:00:00', '2025-11-17 13:30:00', 50, 50, 600.00, 'Non-AC'),

-- Chennai Routes
('CH01AC', 'Chennai Deluxe', 'Chennai', 'Coimbatore', '2025-11-12 21:00:00', '2025-11-13 05:00:00', 35, 35, 1500.00, 'AC'),
('CH02SL', 'Tamil Nadu Sleeper', 'Chennai', 'Coimbatore', '2025-11-13 22:30:00', '2025-11-14 06:30:00', 32, 32, 1100.00, 'Sleeper'),
('CH03NA', 'Chennai Express', 'Chennai', 'Coimbatore', '2025-11-14 07:00:00', '2025-11-14 15:00:00', 45, 45, 800.00, 'Non-AC'),

('CH04AC', 'Coastal Deluxe', 'Chennai', 'Pondicherry', '2025-11-18 06:30:00', '2025-11-18 10:30:00', 30, 30, 600.00, 'AC'),
('CH05SL', 'French Town Sleeper', 'Chennai', 'Pondicherry', '2025-11-19 22:00:00', '2025-11-20 02:00:00', 28, 28, 450.00, 'Sleeper'),
('CH06NA', 'Coastal Express', 'Chennai', 'Pondicherry', '2025-11-20 08:00:00', '2025-11-20 12:00:00', 40, 40, 300.00, 'Non-AC'),

-- Kolkata Routes
('KO01AC', 'Kolkata Luxury', 'Kolkata', 'Durgapur', '2025-11-19 07:00:00', '2025-11-19 11:30:00', 35, 35, 700.00, 'AC'),
('KO02SL', 'Bengal Sleeper', 'Kolkata', 'Durgapur', '2025-11-20 21:00:00', '2025-11-21 02:00:00', 32, 32, 500.00, 'Sleeper'),
('KO03NA', 'Kolkata Express', 'Kolkata', 'Durgapur', '2025-11-21 06:30:00', '2025-11-21 11:00:00', 45, 45, 350.00, 'Non-AC'),

('KO04AC', 'Eastern Deluxe', 'Kolkata', 'Bhubaneswar', '2025-11-22 20:00:00', '2025-11-23 06:00:00', 40, 40, 1300.00, 'AC'),
('KO05SL', 'Odisha Sleeper', 'Kolkata', 'Bhubaneswar', '2025-11-23 22:00:00', '2025-11-24 08:00:00', 35, 35, 900.00, 'Sleeper'),
('KO06NA', 'Eastern Express', 'Kolkata', 'Bhubaneswar', '2025-11-24 07:00:00', '2025-11-24 17:00:00', 50, 50, 600.00, 'Non-AC'),

-- Hyderabad Routes
('HY01AC', 'Hyderabad Luxury', 'Hyderabad', 'Vijayawada', '2025-11-25 06:30:00', '2025-11-25 11:30:00', 35, 35, 800.00, 'AC'),
('HY02SL', 'Telangana Sleeper', 'Hyderabad', 'Vijayawada', '2025-11-26 21:00:00', '2025-11-27 03:00:00', 32, 32, 600.00, 'Sleeper'),
('HY03NA', 'Hyderabad Express', 'Hyderabad', 'Vijayawada', '2025-11-27 07:00:00', '2025-11-27 12:30:00', 45, 45, 400.00, 'Non-AC'),

('HY04AC', 'Deccan Deluxe', 'Hyderabad', 'Bangalore', '2025-11-28 08:00:00', '2025-11-28 16:00:00', 40, 40, 1400.00, 'AC'),
('HY05SL', 'IT Corridor Sleeper', 'Hyderabad', 'Bangalore', '2025-11-29 20:30:00', '2025-11-30 05:30:00', 35, 35, 1000.00, 'Sleeper'),
('HY06NA', 'Deccan Express', 'Hyderabad', 'Bangalore', '2025-11-30 06:00:00', '2025-11-30 15:00:00', 50, 50, 700.00, 'Non-AC'),

-- Ahmedabad Routes
('AH01AC', 'Ahmedabad Luxury', 'Ahmedabad', 'Surat', '2025-11-20 07:00:00', '2025-11-20 12:30:00', 35, 35, 600.00, 'AC'),
('AH02SL', 'Gujarat Sleeper', 'Ahmedabad', 'Surat', '2025-11-21 22:00:00', '2025-11-22 04:00:00', 32, 32, 450.00, 'Sleeper'),
('AH03NA', 'Gujarat Express', 'Ahmedabad', 'Surat', '2025-11-22 06:30:00', '2025-11-22 12:00:00', 45, 45, 300.00, 'Non-AC'),

('AH04AC', 'Heritage Deluxe', 'Ahmedabad', 'Udaipur', '2025-12-01 08:00:00', '2025-12-01 15:00:00', 40, 40, 900.00, 'AC'),
('AH05SL', 'Rajasthan Sleeper', 'Ahmedabad', 'Udaipur', '2025-12-02 21:00:00', '2025-12-03 04:00:00', 35, 35, 650.00, 'Sleeper'),
('AH06NA', 'Heritage Express', 'Ahmedabad', 'Udaipur', '2025-12-03 07:00:00', '2025-12-03 14:30:00', 50, 50, 450.00, 'Non-AC'),

-- Pune Routes
('PU01AC', 'Pune Luxury', 'Pune', 'Mumbai', '2025-12-04 07:00:00', '2025-12-04 11:00:00', 35, 35, 850.00, 'AC'),
('PU02SL', 'Pune Sleeper', 'Pune', 'Mumbai', '2025-12-05 22:30:00', '2025-12-06 03:30:00', 32, 32, 700.00, 'Sleeper'),
('PU03NA', 'Pune Express', 'Pune', 'Mumbai', '2025-12-06 06:00:00', '2025-12-06 10:30:00', 45, 45, 500.00, 'Non-AC'),

('PU04AC', 'Pune Deluxe', 'Pune', 'Goa', '2025-12-07 19:00:00', '2025-12-08 07:00:00', 30, 30, 1600.00, 'AC'),
('PU05SL', 'Pune Goa Sleeper', 'Pune', 'Goa', '2025-12-08 20:30:00', '2025-12-09 08:30:00', 28, 28, 1100.00, 'Sleeper'),
('PU06NA', 'Pune Coastal Express', 'Pune', 'Goa', '2025-12-09 08:00:00', '2025-12-09 20:00:00', 40, 40, 800.00, 'Non-AC'),

-- Lucknow Routes
('LU01AC', 'Lucknow Luxury', 'Lucknow', 'Varanasi', '2025-11-15 19:00:00', '2025-11-16 03:00:00', 32, 32, 1100.00, 'AC'),
('LU02SL', 'Uttar Pradesh Sleeper', 'Lucknow', 'Varanasi', '2025-11-16 21:30:00', '2025-11-17 05:30:00', 30, 30, 800.00, 'Sleeper'),
('LU03NA', 'Lucknow Express', 'Lucknow', 'Varanasi', '2025-11-17 06:30:00', '2025-11-17 14:30:00', 45, 45, 550.00, 'Non-AC'),

('LU04AC', 'Capital Deluxe', 'Lucknow', 'Delhi', '2025-12-10 08:00:00', '2025-12-10 16:00:00', 40, 40, 1300.00, 'AC'),
('LU05SL', 'UP Sleeper', 'Lucknow', 'Delhi', '2025-12-11 21:00:00', '2025-12-12 05:00:00', 35, 35, 900.00, 'Sleeper'),
('LU06NA', 'Capital Express', 'Lucknow', 'Delhi', '2025-12-12 07:00:00', '2025-12-12 15:30:00', 50, 50, 600.00, 'Non-AC'),

-- Jaipur Routes
('JA01AC', 'Jaipur Luxury', 'Jaipur', 'Udaipur', '2025-11-25 09:00:00', '2025-11-25 16:00:00', 35, 35, 900.00, 'AC'),
('JA02SL', 'Rajasthan Sleeper', 'Jaipur', 'Udaipur', '2025-11-26 20:30:00', '2025-11-27 04:30:00', 32, 32, 650.00, 'Sleeper'),
('JA03NA', 'Jaipur Express', 'Jaipur', 'Udaipur', '2025-11-27 07:30:00', '2025-11-27 15:00:00', 45, 45, 450.00, 'Non-AC'),

('JA04AC', 'Pink City Deluxe', 'Jaipur', 'Delhi', '2025-12-13 07:00:00', '2025-12-13 13:00:00', 40, 40, 1200.00, 'AC'),
('JA05SL', 'Rajasthan Delhi Sleeper', 'Jaipur', 'Delhi', '2025-12-14 22:00:00', '2025-12-15 04:00:00', 35, 35, 800.00, 'Sleeper'),
('JA06NA', 'Pink City Express', 'Jaipur', 'Delhi', '2025-12-15 06:30:00', '2025-12-15 12:30:00', 50, 50, 500.00, 'Non-AC'),

-- Bhopal Routes
('BH01AC', 'Bhopal Luxury', 'Bhopal', 'Indore', '2025-11-28 20:00:00', '2025-11-29 02:00:00', 35, 35, 700.00, 'AC'),
('BH02SL', 'Madhya Pradesh Sleeper', 'Bhopal', 'Indore', '2025-11-29 21:30:00', '2025-11-30 03:30:00', 32, 32, 500.00, 'Sleeper'),
('BH03NA', 'Bhopal Express', 'Bhopal', 'Indore', '2025-11-30 07:00:00', '2025-11-30 13:00:00', 45, 45, 350.00, 'Non-AC'),

-- Chandigarh Routes
('CHD01AC', 'Chandigarh Luxury', 'Chandigarh', 'Delhi', '2025-12-16 06:30:00', '2025-12-16 11:00:00', 35, 35, 800.00, 'AC'),
('CHD02SL', 'Chandigarh Sleeper', 'Chandigarh', 'Delhi', '2025-12-17 22:00:00', '2025-12-18 03:00:00', 32, 32, 550.00, 'Sleeper'),
('CHD03NA', 'Chandigarh Express', 'Chandigarh', 'Delhi', '2025-12-18 07:00:00', '2025-12-18 12:00:00', 45, 45, 400.00, 'Non-AC'),

-- Special Routes (Long Distance)
('SP01AC', 'Golden Triangle Deluxe', 'Delhi', 'Agra', '2025-12-19 06:00:00', '2025-12-19 10:30:00', 30, 30, 600.00, 'AC'),
('SP02SL', 'Taj Mahal Sleeper', 'Delhi', 'Agra', '2025-12-20 21:00:00', '2025-12-21 02:00:00', 28, 28, 400.00, 'Sleeper'),

('SP03AC', 'Kerala Deluxe', 'Bangalore', 'Kochi', '2025-12-21 19:00:00', '2025-12-22 08:00:00', 35, 35, 1800.00, 'AC'),
('SP04SL', 'Kerala Sleeper', 'Bangalore', 'Kochi', '2025-12-22 20:30:00', '2025-12-23 09:30:00', 32, 32, 1200.00, 'Sleeper'),

('SP05AC', 'Himalayan Deluxe', 'Delhi', 'Manali', '2025-12-23 18:00:00', '2025-12-24 08:00:00', 25, 25, 2200.00, 'AC'),
('SP06SL', 'Himalayan Sleeper', 'Delhi', 'Manali', '2025-12-24 19:30:00', '2025-12-25 09:30:00', 30, 30, 1500.00, 'Sleeper');