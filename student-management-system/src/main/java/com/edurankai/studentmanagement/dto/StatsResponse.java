package com.edurankai.studentmanagement.dto;

public record StatsResponse(
        Long totalStudents,
        Long activeStudents,
        Long inactiveStudents,
        Long totalCourses
) {
}