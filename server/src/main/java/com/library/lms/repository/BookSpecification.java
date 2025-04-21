package com.library.lms.repository;

import com.library.lms.dto.BookSearchDTO;
import com.library.lms.model.Book;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class BookSpecification {
    
    public static Specification<Book> searchBooks(BookSearchDTO searchDTO) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // General search query across multiple fields
            if (searchDTO.getQuery() != null && !searchDTO.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + searchDTO.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("genre")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("publisher")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm)
                ));
            }
            
            // Specific field filters
            if (searchDTO.getGenre() != null && !searchDTO.getGenre().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("genre")),
                    "%" + searchDTO.getGenre().toLowerCase() + "%"
                ));
            }
            
            if (searchDTO.getAuthor() != null && !searchDTO.getAuthor().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("author")),
                    "%" + searchDTO.getAuthor().toLowerCase() + "%"
                ));
            }
            
            if (searchDTO.getPublisher() != null && !searchDTO.getPublisher().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("publisher")),
                    "%" + searchDTO.getPublisher().toLowerCase() + "%"
                ));
            }
            
            // Publication year range
            if (searchDTO.getYearFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("publicationYear"),
                    searchDTO.getYearFrom()
                ));
            }
            
            if (searchDTO.getYearTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("publicationYear"),
                    searchDTO.getYearTo()
                ));
            }
            
            // Availability filter
            if (searchDTO.getAvailable() != null && searchDTO.getAvailable()) {
                predicates.add(criteriaBuilder.greaterThan(
                    root.get("availableCopies"),
                    0
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
} 