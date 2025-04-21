package com.library.lms.service;

import com.library.lms.model.Book;
import com.library.lms.model.BookBorrowing;
import com.library.lms.model.BorrowingStatus;
import com.library.lms.model.User;
import com.library.lms.repository.BookBorrowingRepository;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookBorrowingService {

    private final BookBorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookBorrowing borrowBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available for borrowing");
        }

        // Check if user already has an active borrowing for this book
        if (borrowingRepository.existsByUserIdAndBookIdAndReturnDateIsNull(userId, bookId)) {
            throw new RuntimeException("You already have borrowed this book");
        }

        // Create new borrowing record
        BookBorrowing borrowing = new BookBorrowing();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setBorrowDate(LocalDateTime.now());
        borrowing.setDueDate(LocalDateTime.now().plusDays(14)); // 2 weeks borrowing period
        borrowing.setStatus(BorrowingStatus.BORROWED);

        // Update book available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    @Transactional
    public BookBorrowing returnBook(Long borrowingId) {
        BookBorrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Borrowing record not found"));

        if (borrowing.getReturnDate() != null) {
            throw new RuntimeException("Book already returned");
        }

        borrowing.setReturnDate(LocalDateTime.now());
        borrowing.setStatus(BorrowingStatus.RETURNED);

        // Update book available copies
        Book book = borrowing.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    public Page<BookBorrowing> getUserBorrowings(Long userId, Pageable pageable) {
        return borrowingRepository.findByUserId(userId, pageable);
    }

    @Transactional
    public void checkOverdueBorrowings() {
        LocalDateTime now = LocalDateTime.now();
        borrowingRepository.findByReturnDateIsNullAndDueDateBefore(now)
                .forEach(borrowing -> {
                    borrowing.setStatus(BorrowingStatus.OVERDUE);
                    borrowingRepository.save(borrowing);
                });
    }

    public List<BookBorrowing> getBookBorrowings(Long bookId) {
        return borrowingRepository.findByBookId(bookId);
    }
} 