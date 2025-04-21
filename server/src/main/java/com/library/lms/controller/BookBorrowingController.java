package com.library.lms.controller;

import com.library.lms.model.BookBorrowing;
import com.library.lms.service.BookBorrowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.library.lms.model.User;
import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BookBorrowingController {
    private final BookBorrowingService borrowingService;

    @PostMapping("/borrow/{bookId}")
    public ResponseEntity<BookBorrowing> borrowBook(
            @PathVariable Long bookId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(borrowingService.borrowBook(user.getId(), bookId));
    }

    @PostMapping("/return/{borrowingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookBorrowing> returnBook(@PathVariable Long borrowingId) {
        return ResponseEntity.ok(borrowingService.returnBook(borrowingId));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<BookBorrowing>> getMyBorrowings(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(borrowingService.getUserBorrowings(user.getId(), pageable));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookBorrowing>> getUserBorrowings(
            @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(borrowingService.getUserBorrowings(userId, pageable));
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookBorrowing>> getBookBorrowings(@PathVariable Long bookId) {
        return ResponseEntity.ok(borrowingService.getBookBorrowings(bookId));
    }

    @PostMapping("/check-overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> checkOverdueBorrowings() {
        borrowingService.checkOverdueBorrowings();
        return ResponseEntity.ok().build();
    }
} 