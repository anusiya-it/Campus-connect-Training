package com.library.lms.repository;

import com.library.lms.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.publisher) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<Book> search(@Param("keyword") String keyword);
}
