
package com.edurankai.studentmanagement.dto;

public record StudentStatsResponse(
        Long totalStudents,
        Long activeStudents,
        Long inactiveStudents
) {}
