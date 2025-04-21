-- Insert admin users with password: Password123
INSERT INTO users (username, email, password, role)
SELECT 'admin1', 'admin1@library.com', 'Password123', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin1');

INSERT INTO users (username, email, password, role)
SELECT 'admin2', 'admin2@library.com', 'Password123', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin2');

-- Insert regular users with password: Password123
INSERT INTO users (username, email, password, role)
SELECT 'user1', 'user1@library.com', 'Password123', 'USER'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user1');

INSERT INTO users (username, email, password, role)
SELECT 'user2', 'user2@library.com', 'Password123', 'USER'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user2');

-- Insert default test user with password: Password123
INSERT INTO users (username, email, password, role)
SELECT 'testuser', 'testuser@library.com', 'Password123', 'USER'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'testuser');

-- Insert sample books
INSERT INTO books (title, author, genre, publisher, publication_year, isbn, available_copies, total_copies, description)
SELECT 'To Kill a Mockingbird', 'Harper Lee', 'Classic Fiction', 'J. B. Lippincott & Co.', 1960, '978-0446310789', 5, 5, 'A powerful story of racial injustice and loss of innocence in the American South.'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0446310789');

INSERT INTO books (title, author, genre, publisher, publication_year, isbn, available_copies, total_copies, description)
SELECT '1984', 'George Orwell', 'Dystopian Fiction', 'Secker and Warburg', 1949, '978-0451524935', 3, 3, 'A dystopian social science fiction novel that explores totalitarianism and mass surveillance.'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0451524935');

INSERT INTO books (title, author, genre, publisher, publication_year, isbn, available_copies, total_copies, description)
SELECT 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 'George Allen & Unwin', 1937, '978-0547928227', 4, 4, 'A fantasy novel about the adventures of hobbit Bilbo Baggins.'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0547928227');

INSERT INTO books (title, author, genre, publisher, publication_year, isbn, available_copies, total_copies, description)
SELECT 'Pride and Prejudice', 'Jane Austen', 'Romance', 'T. Egerton, Whitehall', 1813, '978-0141439518', 2, 2, 'A romantic novel following the emotional development of Elizabeth Bennet.'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0141439518');

INSERT INTO books (title, author, genre, publisher, publication_year, isbn, available_copies, total_copies, description)
SELECT 'A Brief History of Time', 'Stephen Hawking', 'Science', 'Bantam Dell', 1988, '978-0553380163', 3, 3, 'A landmark volume in science writing that explores the origins and fate of the universe.'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0553380163'); 