package com.library.lms.repository;

import com.library.lms.model.BookBorrowing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookBorrowingRepository extends JpaRepository<BookBorrowing, Long> {
    boolean existsByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);
    Page<BookBorrowing> findByUserId(Long userId, Pageable pageable);
    List<BookBorrowing> findByReturnDateIsNullAndDueDateBefore(LocalDateTime dueDate);
    List<BookBorrowing> findByBookId(Long bookId);
} 