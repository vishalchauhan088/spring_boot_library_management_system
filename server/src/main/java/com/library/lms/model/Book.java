package com.library.lms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    @NotBlank
    private String isbn;

    private String description;

    @NotNull
    private Integer totalCopies;

    @NotNull
    private Integer availableCopies;

    @OneToMany(mappedBy = "book")
    private Set<BookBorrowing> borrowings = new HashSet<>();

    private String genre;
    private String publisher;
    private Integer publicationYear;
} 