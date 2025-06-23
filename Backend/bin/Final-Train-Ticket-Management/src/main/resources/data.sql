-- Sample Users
INSERT INTO users (name, email, contact_number, address) VALUES 
('John Doe', 'john.doe@example.com', '9876543210', '123 Main St, Mumbai'),
('Jane Smith', 'jane.smith@example.com', '9876543211', '456 Park Ave, Delhi'),
('Bob Johnson', 'bob.johnson@example.com', '9876543212', '789 Oak Rd, Bangalore'),
('Alice Brown', 'alice.brown@example.com', '9876543213', '321 Pine St, Chennai'),
('Charlie Wilson', 'charlie.wilson@example.com', '9876543214', '654 Elm St, Kolkata');

-- Sample Login Records
INSERT INTO logins (email, password, user_type, status, user_id) VALUES 
('john.doe@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'CUSTOMER', 'ACTIVE', (SELECT id FROM users WHERE email = 'john.doe@example.com')),
('jane.smith@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'CUSTOMER', 'ACTIVE', (SELECT id FROM users WHERE email = 'jane.smith@example.com')),
('bob.johnson@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'CUSTOMER', 'ACTIVE', (SELECT id FROM users WHERE email = 'bob.johnson@example.com')),
('alice.brown@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'CUSTOMER', 'ACTIVE', (SELECT id FROM users WHERE email = 'alice.brown@example.com')),
('charlie.wilson@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'CUSTOMER', 'ACTIVE', (SELECT id FROM users WHERE email = 'charlie.wilson@example.com')),
('admin@train.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'ADMIN', 'ACTIVE', NULL);

-- Sample Trains
INSERT INTO trains (train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, available_seats, price, status) VALUES 
('12345', 'Rajdhani Express', 'Mumbai', 'Delhi', '2024-01-15 10:00:00', '2024-01-16 08:00:00', 100, 80, 1500.0, 'ACTIVE'),
('12346', 'Shatabdi Express', 'Delhi', 'Mumbai', '2024-01-15 14:00:00', '2024-01-16 12:00:00', 80, 60, 1200.0, 'ACTIVE'),
('12347', 'Duronto Express', 'Bangalore', 'Chennai', '2024-01-15 08:00:00', '2024-01-15 14:00:00', 120, 100, 800.0, 'ACTIVE'),
('12348', 'Garib Rath', 'Chennai', 'Kolkata', '2024-01-15 16:00:00', '2024-01-16 20:00:00', 150, 120, 600.0, 'ACTIVE'),
('12349', 'Superfast Express', 'Kolkata', 'Mumbai', '2024-01-15 12:00:00', '2024-01-17 06:00:00', 90, 70, 1800.0, 'ACTIVE');

-- Sample Passengers
INSERT INTO passengers (name, age, gender, user_id) VALUES 
('John Doe', 35, 'MALE', (SELECT id FROM users WHERE email = 'john.doe@example.com')),
('Jane Smith', 28, 'FEMALE', (SELECT id FROM users WHERE email = 'jane.smith@example.com')),
('Bob Johnson', 45, 'MALE', (SELECT id FROM users WHERE email = 'bob.johnson@example.com')),
('Alice Brown', 32, 'FEMALE', (SELECT id FROM users WHERE email = 'alice.brown@example.com')),
('Charlie Wilson', 55, 'MALE', (SELECT id FROM users WHERE email = 'charlie.wilson@example.com')),
('Emma Davis', 25, 'FEMALE', (SELECT id FROM users WHERE email = 'john.doe@example.com')),
('Michael Lee', 40, 'MALE', (SELECT id FROM users WHERE email = 'jane.smith@example.com'));

-- Sample Food Items
INSERT INTO foods (name, description, price, available, category) VALUES 
('Veg Biryani', 'Delicious vegetarian biryani with aromatic spices', 250.0, true, 'LUNCH'),
('Chicken Curry', 'Spicy chicken curry with rice', 300.0, true, 'LUNCH'),
('Masala Dosa', 'Crispy dosa with potato filling', 120.0, true, 'BREAKFAST'),
('Idli Sambar', 'Soft idli with hot sambar', 80.0, true, 'BREAKFAST'),
('Butter Chicken', 'Creamy butter chicken with naan', 350.0, true, 'DINNER'),
('Dal Khichdi', 'Comforting dal khichdi', 150.0, true, 'DINNER'),
('Samosa', 'Crispy samosa with chutney', 50.0, true, 'SNACKS'),
('Tea', 'Hot masala tea', 30.0, true, 'BEVERAGES'),
('Coffee', 'Filter coffee', 40.0, true, 'BEVERAGES'),
('Sandwich', 'Veg sandwich', 100.0, true, 'SNACKS');

-- Sample Bookings
INSERT INTO bookings (user_id, train_id, passenger_id, journey_date, seat_number, booking_date, total_amount, status) VALUES 
((SELECT id FROM users WHERE email = 'john.doe@example.com'), (SELECT id FROM trains WHERE train_number = '12345'), (SELECT id FROM passengers WHERE name = 'John Doe' AND user_id = (SELECT id FROM users WHERE email = 'john.doe@example.com')), '2024-01-20 10:00:00', 'A1', '2024-01-10 15:30:00', 1500.0, 'CONFIRMED'),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), (SELECT id FROM trains WHERE train_number = '12346'), (SELECT id FROM passengers WHERE name = 'Jane Smith' AND user_id = (SELECT id FROM users WHERE email = 'jane.smith@example.com')), '2024-01-21 14:00:00', 'B3', '2024-01-11 10:15:00', 1200.0, 'CONFIRMED'),
((SELECT id FROM users WHERE email = 'bob.johnson@example.com'), (SELECT id FROM trains WHERE train_number = '12347'), (SELECT id FROM passengers WHERE name = 'Bob Johnson' AND user_id = (SELECT id FROM users WHERE email = 'bob.johnson@example.com')), '2024-01-22 08:00:00', 'C5', '2024-01-12 09:45:00', 800.0, 'CONFIRMED'),
((SELECT id FROM users WHERE email = 'alice.brown@example.com'), (SELECT id FROM trains WHERE train_number = '12348'), (SELECT id FROM passengers WHERE name = 'Alice Brown' AND user_id = (SELECT id FROM users WHERE email = 'alice.brown@example.com')), '2024-01-23 16:00:00', 'D2', '2024-01-13 14:20:00', 600.0, 'CONFIRMED'),
((SELECT id FROM users WHERE email = 'charlie.wilson@example.com'), (SELECT id FROM trains WHERE train_number = '12349'), (SELECT id FROM passengers WHERE name = 'Charlie Wilson' AND user_id = (SELECT id FROM users WHERE email = 'charlie.wilson@example.com')), '2024-01-24 12:00:00', 'E7', '2024-01-14 11:30:00', 1800.0, 'CONFIRMED');

-- Sample Tickets
INSERT INTO tickets (person_id, location_id, start_date, end_date, status, booking_id) VALUES 
((SELECT id FROM users WHERE email = 'john.doe@example.com'), (SELECT id FROM trains WHERE train_number = '12345'), '2024-01-20 10:00:00', '2024-01-16 08:00:00', 'ACTIVE', (SELECT id FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'john.doe@example.com') AND train_id = (SELECT id FROM trains WHERE train_number = '12345'))),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), (SELECT id FROM trains WHERE train_number = '12346'), '2024-01-21 14:00:00', '2024-01-16 12:00:00', 'ACTIVE', (SELECT id FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'jane.smith@example.com') AND train_id = (SELECT id FROM trains WHERE train_number = '12346'))),
((SELECT id FROM users WHERE email = 'bob.johnson@example.com'), (SELECT id FROM trains WHERE train_number = '12347'), '2024-01-22 08:00:00', '2024-01-15 14:00:00', 'ACTIVE', (SELECT id FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'bob.johnson@example.com') AND train_id = (SELECT id FROM trains WHERE train_number = '12347'))),
((SELECT id FROM users WHERE email = 'alice.brown@example.com'), (SELECT id FROM trains WHERE train_number = '12348'), '2024-01-23 16:00:00', '2024-01-16 20:00:00', 'ACTIVE', (SELECT id FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'alice.brown@example.com') AND train_id = (SELECT id FROM trains WHERE train_number = '12348'))),
((SELECT id FROM users WHERE email = 'charlie.wilson@example.com'), (SELECT id FROM trains WHERE train_number = '12349'), '2024-01-24 12:00:00', '2024-01-17 06:00:00', 'ACTIVE', (SELECT id FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'charlie.wilson@example.com') AND train_id = (SELECT id FROM trains WHERE train_number = '12349')));

-- Update train available seats based on bookings
UPDATE trains SET available_seats = available_seats - 1 WHERE train_number IN ('12345', '12346', '12347', '12348', '12349'); 