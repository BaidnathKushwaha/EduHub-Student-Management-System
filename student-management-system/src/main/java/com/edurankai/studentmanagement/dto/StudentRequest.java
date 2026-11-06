package com.edurankai.studentmanagement.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record StudentRequest(

        @NotBlank(message = "Student name is required")
        @Size(min = 2, max = 100,
                message = "Name must contain 2 to 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 255, message = "Email is too long")
        String email,

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "^[0-9]{7,16}$",
                message = "Phone must contain 7 to 16 digits"
        )
        String phoneNumber,

        @NotNull(message = "Course is required")
        @Positive(message = "Course ID must be positive")
        Long courseId,

        @NotNull(message = "Enrollment date is required")
        LocalDate enrollmentDate,

        @NotBlank(message = "Status is required")
        @Pattern(
                regexp = "^(Active|Inactive)$",
                message = "Status must be Active or Inactive"
        )
        String status

) {}
