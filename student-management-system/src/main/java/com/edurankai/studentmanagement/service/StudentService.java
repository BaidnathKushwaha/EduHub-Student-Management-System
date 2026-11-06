
package com.edurankai.studentmanagement.service;

import com.edurankai.studentmanagement.dto.StudentRequest;
import com.edurankai.studentmanagement.dto.StudentResponse;

import com.edurankai.studentmanagement.entity.Course;
import com.edurankai.studentmanagement.entity.Student;

import com.edurankai.studentmanagement.exception.ConflictException;
import com.edurankai.studentmanagement.exception.ResourceNotFoundException;

import com.edurankai.studentmanagement.repository.CourseRepository;
import com.edurankai.studentmanagement.repository.StudentRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentService(StudentRepository studentRepository,
                          CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    // Register student
    public StudentResponse createStudent(StudentRequest request) {

        String email = normalizeEmail(request.email());

        if (studentRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered");
        }

        Course course = getCourse(request.courseId());

        Student student = new Student(
                request.fullName().trim(),
                email,
                request.phoneNumber(),
                course,
                request.enrollmentDate(),
                request.status()
        );

        try {
            Student savedStudent = studentRepository.saveAndFlush(student);
            return mapToResponse(savedStudent);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException(
                    "Email is already registered or student data violates a database constraint"
            );
        }
    }

    // Get all students with search and filters
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents(
            String search, Long courseId, String status) {

        if (courseId != null && courseId <= 0) {
            throw new IllegalArgumentException("Course ID must be positive");
        }

        if (status != null && !status.equals("Active")
                && !status.equals("Inactive")) {
            throw new IllegalArgumentException(
                    "Status must be Active or Inactive"
            );
        }

        String searchValue = (search == null || search.isBlank())
                ? null : search.trim();

        return studentRepository.searchStudents(
                        searchValue, courseId, status
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get individual student
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with ID: " + id
                ));

        return mapToResponse(student);
    }

    // Update student
    public StudentResponse updateStudent(Long id, StudentRequest request) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with ID: " + id
                ));

        String email = normalizeEmail(request.email());

        if (studentRepository.existsByEmailAndIdNot(email, id)) {
            throw new ConflictException("Email is already registered");
        }

        Course course = getCourse(request.courseId());

        student.setFullName(request.fullName().trim());
        student.setEmail(email);
        student.setPhoneNumber(request.phoneNumber());
        student.setCourse(course);
        student.setEnrollmentDate(request.enrollmentDate());
        student.setStatus(request.status());

        try {
            Student updatedStudent = studentRepository.saveAndFlush(student);
            return mapToResponse(updatedStudent);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException(
                    "Email is already registered or student data violates a database constraint"
            );
        }
    }

    // Delete student
    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with ID: " + id
                ));

        studentRepository.delete(student);
    }

    // Find course or throw exception
    private Course getCourse(Long courseId) {

        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + courseId
                ));
    }

    // Normalize email
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    // Convert entity to response DTO
    private StudentResponse mapToResponse(Student student) {

        return new StudentResponse(
                student.getId(),
                student.getFullName(),
                student.getEmail(),
                student.getPhoneNumber(),
                student.getCourse().getId(),
                student.getCourse().getName(),
                student.getEnrollmentDate(),
                student.getStatus()
        );
    }
}
