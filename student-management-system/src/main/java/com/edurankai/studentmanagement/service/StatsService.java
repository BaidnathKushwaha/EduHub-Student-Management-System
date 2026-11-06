
package com.edurankai.studentmanagement.service;

import com.edurankai.studentmanagement.dto.StatsResponse;
import com.edurankai.studentmanagement.dto.StudentStatsResponse;

import com.edurankai.studentmanagement.repository.CourseRepository;
import com.edurankai.studentmanagement.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StatsService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StatsService(StudentRepository studentRepository,
                        CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public StatsResponse getDashboardStats() {

        StudentStatsResponse studentStats =
                studentRepository.getStudentStatistics();

        long totalCourses = courseRepository.count();

        return new StatsResponse(
                studentStats.totalStudents(),
                studentStats.activeStudents(),
                studentStats.inactiveStudents(),
                totalCourses
        );
    }
}
