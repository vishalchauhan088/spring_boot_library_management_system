package com.library.lms.dto;

import lombok.Data;

@Data
public class BookSearchDTO {
    private String query; // General search query
    private String genre;
    private String author;
    private String publisher;
    private Integer yearFrom;
    private Integer yearTo;
    private Boolean available; // true to show only books with available copies
} 