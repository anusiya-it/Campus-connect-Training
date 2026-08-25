package com.library.lms.dto;

import com.library.lms.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private Long id;

    private Long bookId;
    private String bookTitle;
    private String bookIsbn;

    private Long memberId;
    private String memberName;
    private String memberEmail;

    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;

    private Integer overdueDays;
    private Double fineAmount;

    private TransactionStatus status;
}
