package com.library.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    private long totalBooks;
    private long availableBooks;
    private long borrowedBooks;
    private long totalMembers;
    private long overdueTransactions;
    private List<TransactionDTO> recentTransactions;
}
