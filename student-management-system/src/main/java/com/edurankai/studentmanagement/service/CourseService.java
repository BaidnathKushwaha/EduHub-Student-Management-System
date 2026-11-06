
package com.edurankai.studentmanagement.service;

import com.edurankai.studentmanagement.dto.CourseRequest;
import com.edurankai.studentmanagement.dto.CourseResponse;
import com.edurankai.studentmanagement.entity.Course;
import com.edurankai.studentmanagement.exception.ConflictException;
import com.edurankai.studentmanagement.exception.ResourceNotFoundException;
import com.edurankai.studentmanagement.repository.CourseRepository;
import com.edurankai.studentmanagement.repository.StudentRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public CourseService(CourseRepository courseRepository,
                         StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    // Create course
    public CourseResponse createCourse(CourseRequest request) {

        String code = request.code().trim();

        if (courseRepository.existsByCode(code)) {
            throw new ConflictException("Course code already exists");
        }

        Course course = new Course(
                code,
                request.name().trim(),
                request.department().trim(),
                request.creditHours() == null ? 3 : request.creditHours()
        );

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    // Get all courses
    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Update course
    public CourseResponse updateCourse(Long id, CourseRequest request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + id
                ));

        String code = request.code().trim();

        courseRepository.findByCode(code)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ConflictException("Course code already exists");
                });

        course.setCode(code);
        course.setName(request.name().trim());
        course.setDepartment(request.department().trim());

        if (request.creditHours() != null) {
            course.setCreditHours(request.creditHours());
        }

        return mapToResponse(courseRepository.save(course));
    }

    // Delete course
    public void deleteCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + id
                ));

        if (studentRepository.existsByCourse_Id(id)) {
            throw new ConflictException(
                    "Cannot delete course because students are enrolled"
            );
        }

        try {
            courseRepository.delete(course);
            courseRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException(
                    "Cannot delete course because it is referenced by students"
            );
        }
    }

    // Convert entity to response DTO
    private CourseResponse mapToResponse(Course course) {

        long enrolledCount =
                studentRepository.countByCourse_Id(course.getId());

        return new CourseResponse(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getDepartment(),
                course.getCreditHours(),
                enrolledCount
        );
    }
}
