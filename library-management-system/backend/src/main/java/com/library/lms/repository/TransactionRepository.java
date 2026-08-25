package com.library.lms.repository;

import com.library.lms.model.Transaction;
import com.library.lms.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByMemberId(Long memberId);

    List<Transaction> findByBookId(Long bookId);

    List<Transaction> findAllByOrderByIssueDateDesc();

    long countByStatus(TransactionStatus status);

    @Query("SELECT t FROM Transaction t WHERE t.status = 'ISSUED' AND t.dueDate < CURRENT_DATE")
    List<Transaction> findOverdueTransactions();
}
