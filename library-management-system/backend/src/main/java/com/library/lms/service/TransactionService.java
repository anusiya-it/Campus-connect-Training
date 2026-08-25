package com.library.lms.service;

import com.library.lms.dto.IssueRequest;
import com.library.lms.dto.ReturnRequest;
import com.library.lms.dto.TransactionDTO;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.model.Book;
import com.library.lms.model.Member;
import com.library.lms.model.Transaction;
import com.library.lms.model.TransactionStatus;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.MemberRepository;
import com.library.lms.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final int LOAN_PERIOD_DAYS = 14;
    private static final double FINE_PER_DAY = 5.0;

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByIssueDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return toDTO(transaction);
    }

    @Transactional
    public TransactionDTO issueBook(IssueRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.getBookId()));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + request.getMemberId()));

        if (book.getAvailableQuantity() == null || book.getAvailableQuantity() <= 0) {
            throw new BadRequestException("No copies of '" + book.getTitle() + "' are currently available");
        }

        LocalDate issueDate = request.getIssueDate() != null ? request.getIssueDate() : LocalDate.now();
        LocalDate dueDate = request.getDueDate() != null ? request.getDueDate() : issueDate.plusDays(LOAN_PERIOD_DAYS);

        Transaction transaction = new Transaction();
        transaction.setBook(book);
        transaction.setMember(member);
        transaction.setIssueDate(issueDate);
        transaction.setDueDate(dueDate);
        transaction.setStatus(TransactionStatus.ISSUED);
        transaction.setOverdueDays(0);
        transaction.setFineAmount(0.0);

        // decrease available quantity
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        Transaction saved = transactionRepository.save(transaction);
        return toDTO(saved);
    }

    @Transactional
    public TransactionDTO returnBook(Long transactionId, ReturnRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        if (transaction.getStatus() == TransactionStatus.RETURNED) {
            throw new BadRequestException("This book has already been returned");
        }

        LocalDate returnDate = (request != null && request.getReturnDate() != null)
                ? request.getReturnDate() : LocalDate.now();

        long overdueDays = 0;
        if (returnDate.isAfter(transaction.getDueDate())) {
            overdueDays = ChronoUnit.DAYS.between(transaction.getDueDate(), returnDate);
        }
        double fine = overdueDays * FINE_PER_DAY;

        transaction.setReturnDate(returnDate);
        transaction.setOverdueDays((int) overdueDays);
        transaction.setFineAmount(fine);
        transaction.setStatus(TransactionStatus.RETURNED);

        // increase available quantity
        Book book = transaction.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);

        Transaction saved = transactionRepository.save(transaction);
        return toDTO(saved);
    }

    public List<TransactionDTO> getOverdueTransactions() {
        return transactionRepository.findOverdueTransactions().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO toDTO(Transaction t) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(t.getId());
        dto.setBookId(t.getBook().getId());
        dto.setBookTitle(t.getBook().getTitle());
        dto.setBookIsbn(t.getBook().getIsbn());
        dto.setMemberId(t.getMember().getId());
        dto.setMemberName(t.getMember().getName());
        dto.setMemberEmail(t.getMember().getEmail());
        dto.setIssueDate(t.getIssueDate());
        dto.setDueDate(t.getDueDate());
        dto.setReturnDate(t.getReturnDate());
        dto.setOverdueDays(t.getOverdueDays());
        dto.setFineAmount(t.getFineAmount());
        dto.setStatus(t.getStatus());
        return dto;
    }
}
