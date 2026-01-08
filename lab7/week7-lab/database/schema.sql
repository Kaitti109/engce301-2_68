-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== MEMBERS TABLE =====
-- TODO: นักศึกษาสร้าง table members
-- ต้องมี: id, name, email (UNIQUE), phone, membership_date, status
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    membership_date TEXT NOT NULL,
    status TEXT NOT NULL,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== BORROWINGS TABLE =====
-- TODO: นักศึกษาสร้าง table borrowings
-- ต้องมี: id, book_id (FK), member_id (FK), borrow_date, due_date, return_date, status
CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    member_id INTEGER,
    borrow_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT NOT NULL,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);


-- TODO: สร้าง indexes สำหรับ members (email)
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
-- TODO: สร้าง indexes สำหรับ borrowings (book_id, member_id, status)
CREATE INDEX IF NOT EXISTS idx_borrowings_book_id ON borrowings(book_id, member_id, status);



-- ===== SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);


-- ===== SAMPLE DATA: Members =====
INSERT INTO members (name, email, phone, membership_date, status) VALUES
    ('Alice Johnson', 'alice@example.com', '123-456-7890', '2024-01-15', 'active'),
    ('Bob Smith', 'bob@example.com', '234-567-8901', '2024-02-20', 'active'),
    ('Charlie Brown', 'charlie@example.com', '345-678-9012', '2024-03-10', 'suspended');

-- ===== SAMPLE DATA: Borrowings =====
-- TODO: Insert 3 borrowings (บางเล่มยืมอยู่, บางเล่มคืนแล้ว)
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, return_date, status) VALUES
    (1, 1, '2024-04-01', '2024-04-15', NULL, 'borrowed'),
    (2, 2, '2024-03-20', '2024-04-03', '2024-04-02', 'returned'),
    (3, 3, '2024-04-05', '2024-04-19', NULL, 'borrowed');
