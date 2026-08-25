-- Sample Books
INSERT INTO books (title, author, isbn, category, publisher, publication_year, quantity, available_quantity) VALUES
('Clean Code', 'Robert C. Martin', '9780132350884', 'Programming', 'Prentice Hall', 2008, 5, 5),
('The Pragmatic Programmer', 'Andrew Hunt', '9780201616224', 'Programming', 'Addison-Wesley', 1999, 4, 4),
('Effective Java', 'Joshua Bloch', '9780134685991', 'Programming', 'Addison-Wesley', 2018, 3, 3),
('Design Patterns', 'Erich Gamma', '9780201633610', 'Programming', 'Addison-Wesley', 1994, 3, 3),
('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'Computer Science', 'MIT Press', 2009, 4, 4),
('Sapiens', 'Yuval Noah Harari', '9780062316097', 'History', 'Harper', 2015, 6, 6),
('Atomic Habits', 'James Clear', '9780735211292', 'Self-Help', 'Avery', 2018, 8, 8),
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 'Scribner', 1925, 5, 5),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 'J. B. Lippincott & Co.', 1960, 5, 5),
('A Brief History of Time', 'Stephen Hawking', '9780553380163', 'Science', 'Bantam', 1988, 3, 3);

-- Sample Members
INSERT INTO members (name, email, phone, address, registration_date) VALUES
('Arjun Kumar', 'arjun.kumar@example.com', '9876543210', '12 MG Road, Salem, TN', '2025-01-15'),
('Priya Sharma', 'priya.sharma@example.com', '9876543211', '45 Anna Nagar, Chennai, TN', '2025-02-10'),
('Rahul Verma', 'rahul.verma@example.com', '9876543212', '78 Park Street, Kolkata, WB', '2025-03-05'),
('Sneha Reddy', 'sneha.reddy@example.com', '9876543213', '23 Banjara Hills, Hyderabad, TS', '2025-04-20'),
('Vikram Singh', 'vikram.singh@example.com', '9876543214', '56 Civil Lines, Jaipur, RJ', '2025-05-12');

-- Sample Transactions (2 currently issued, 1 returned on time, 1 returned overdue)
INSERT INTO transactions (book_id, member_id, issue_date, due_date, return_date, overdue_days, fine_amount, status) VALUES
(1, 1, CURRENT_DATE - 5, CURRENT_DATE + 9, NULL, 0, 0.0, 'ISSUED'),
(6, 2, CURRENT_DATE - 3, CURRENT_DATE + 11, NULL, 0, 0.0, 'ISSUED'),
(7, 3, CURRENT_DATE - 20, CURRENT_DATE - 6, CURRENT_DATE - 6, 0, 0.0, 'RETURNED'),
(9, 4, CURRENT_DATE - 25, CURRENT_DATE - 11, CURRENT_DATE - 5, 6, 30.0, 'RETURNED');

-- Adjust available quantities for currently issued books (book 1 and book 6 have 1 copy out each)
UPDATE books SET available_quantity = available_quantity - 1 WHERE id = 1;
UPDATE books SET available_quantity = available_quantity - 1 WHERE id = 6;
