package com.library.lms.service;

import com.library.lms.dto.DashboardStatsDTO;
import com.library.lms.dto.TransactionDTO;
import com.library.lms.model.Book;
import com.library.lms.model.TransactionStatus;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.MemberRepository;
import com.library.lms.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public DashboardStatsDTO getStats() {
        long totalBooks = bookRepository.findAll().stream()
                .mapToInt(Book::getQuantity)
                .sum();

        long availableBooks = bookRepository.findAll().stream()
                .mapToInt(Book::getAvailableQuantity)
                .sum();

        long borrowedBooks = transactionRepository.countByStatus(TransactionStatus.ISSUED);
        long totalMembers = memberRepository.count();
        long overdueTransactions = transactionRepository.findOverdueTransactions().size();

        List<TransactionDTO> recent = transactionService.getAllTransactions().stream()
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardStatsDTO(totalBooks, availableBooks, borrowedBooks, totalMembers, overdueTransactions, recent);
    }
}
