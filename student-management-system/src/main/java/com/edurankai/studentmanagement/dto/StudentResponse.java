
package com.edurankai.studentmanagement.dto;

import java.time.LocalDate;

public record StudentResponse(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        Long courseId,
        String courseName,
        LocalDate enrollmentDate,
        String status
) {}
