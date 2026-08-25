package com.library.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {

    // Optional - defaults to today if not provided
    private LocalDate returnDate;
}
