
package com.edurankai.studentmanagement.controller;

import com.edurankai.studentmanagement.dto.StudentRequest;
import com.edurankai.studentmanagement.dto.StudentResponse;
import com.edurankai.studentmanagement.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Register student
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(
            @Valid @RequestBody StudentRequest request) {

        return studentService.createStudent(request);
    }

    // Get students with search and filters
    @GetMapping
    public List<StudentResponse> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String status) {

        return studentService.getAllStudents(search, courseId, status);
    }

    // Get individual student
    @GetMapping("/{id}")
    public StudentResponse getStudentById(@PathVariable Long id) {

        return studentService.getStudentById(id);
    }

    // Update student
    @PutMapping("/{id}")
    public StudentResponse updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        return studentService.updateStudent(id, request);
    }

    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return ResponseEntity.ok(
                Map.of("message", "Student deleted successfully")
        );
    }
}
