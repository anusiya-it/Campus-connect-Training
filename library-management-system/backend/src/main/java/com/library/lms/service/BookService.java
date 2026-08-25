package com.library.lms.service;

import com.library.lms.dto.BookDTO;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.model.Book;
import com.library.lms.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return toDTO(book);
    }

    public List<BookDTO> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBooks();
        }
        return bookRepository.search(keyword.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookDTO createBook(BookDTO dto) {
        if (bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new BadRequestException("A book with ISBN " + dto.getIsbn() + " already exists");
        }
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setCategory(dto.getCategory());
        book.setPublisher(dto.getPublisher());
        book.setPublicationYear(dto.getPublicationYear());
        book.setQuantity(dto.getQuantity());
        // available quantity defaults to full quantity on creation
        book.setAvailableQuantity(dto.getAvailableQuantity() != null ? dto.getAvailableQuantity() : dto.getQuantity());
        Book saved = bookRepository.save(book);
        return toDTO(saved);
    }

    @Transactional
    public BookDTO updateBook(Long id, BookDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        if (!book.getIsbn().equals(dto.getIsbn()) && bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new BadRequestException("A book with ISBN " + dto.getIsbn() + " already exists");
        }

        int issuedCopies = book.getQuantity() - book.getAvailableQuantity();
        if (dto.getQuantity() < issuedCopies) {
            throw new BadRequestException("Quantity cannot be less than currently issued copies (" + issuedCopies + ")");
        }

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setCategory(dto.getCategory());
        book.setPublisher(dto.getPublisher());
        book.setPublicationYear(dto.getPublicationYear());
        book.setQuantity(dto.getQuantity());
        // recompute available quantity so issued-copy count stays consistent
        book.setAvailableQuantity(dto.getQuantity() - issuedCopies);

        Book saved = bookRepository.save(book);
        return toDTO(saved);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        if (!book.getAvailableQuantity().equals(book.getQuantity())) {
            throw new BadRequestException("Cannot delete book: some copies are currently issued");
        }
        bookRepository.delete(book);
    }

    private BookDTO toDTO(Book book) {
        return new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getCategory(),
                book.getPublisher(),
                book.getPublicationYear(),
                book.getQuantity(),
                book.getAvailableQuantity()
        );
    }
}
