
package com.edurankai.studentmanagement.dto;

import jakarta.validation.constraints.*;

public record CourseRequest(

        @NotBlank(message = "Course code is required")
        @Size(max = 30)
        String code,

        @NotBlank(message = "Course name is required")
        @Size(max = 120)
        String name,

        @NotBlank(message = "Department is required")
        @Size(max = 80)
        String department,

        @Min(value = 1, message = "Minimum credit hours is 1")
        @Max(value = 12, message = "Maximum credit hours is 12")
        Integer creditHours

) {}
