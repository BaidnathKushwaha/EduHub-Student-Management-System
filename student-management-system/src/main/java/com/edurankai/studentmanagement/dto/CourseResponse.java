
package com.edurankai.studentmanagement.dto;

public record CourseResponse(
        Long id,
        String code,
        String name,
        String department,
        Integer creditHours,
        Long enrolledStudents
) {}
