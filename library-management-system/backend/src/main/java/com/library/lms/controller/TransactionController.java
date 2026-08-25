package com.library.lms.controller;

import com.library.lms.dto.IssueRequest;
import com.library.lms.dto.ReturnRequest;
import com.library.lms.dto.TransactionDTO;
import com.library.lms.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TransactionDTO>> getOverdueTransactions() {
        return ResponseEntity.ok(transactionService.getOverdueTransactions());
    }

    @PostMapping("/issue")
    public ResponseEntity<TransactionDTO> issueBook(@Valid @RequestBody IssueRequest request) {
        TransactionDTO created = transactionService.issueBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<TransactionDTO> returnBook(@PathVariable Long id,
                                                       @RequestBody(required = false) ReturnRequest request) {
        return ResponseEntity.ok(transactionService.returnBook(id, request));
    }
}
