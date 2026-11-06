package com.edurankai.studentmanagement;

import com.edurankai.studentmanagement.entity.Course;
import com.edurankai.studentmanagement.repository.CourseRepository;
import com.edurankai.studentmanagement.repository.StudentRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StudentManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    private Long courseId;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
        courseRepository.deleteAll();

        Course course = new Course(
                "CSE101",
                "Computer Science",
                "Engineering",
                4
        );

        courseId = courseRepository.saveAndFlush(course).getId();
    }

    private Map<String, Object> validStudent() {
        return Map.of(
                "fullName", "Rahul Sharma",
                "email", "rahul@example.com",
                "phoneNumber", "9876543210",
                "courseId", courseId,
                "enrollmentDate", "2026-11-06",
                "status", "Active"
        );
    }

    private long createStudent() throws Exception {
        String response = mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validStudent())))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("id").asLong();
    }

    // Test 1: Course seed/read returns HTTP 200
    @Test
    void shouldReturnCourses() throws Exception {

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("CSE101"));
    }

    // Test 2: Valid student enrollment returns HTTP 201
    @Test
    void shouldCreateStudent() throws Exception {

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validStudent())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fullName").value("Rahul Sharma"))
                .andExpect(jsonPath("$.email").value("rahul@example.com"));
    }

    // Test 3: Invalid student input returns HTTP 400
    @Test
    void shouldRejectInvalidStudent() throws Exception {

        Map<String, Object> invalidStudent = Map.of(
                "fullName", "",
                "email", "wrong-email",
                "phoneNumber", "123",
                "courseId", courseId,
                "enrollmentDate", "2026-11-06",
                "status", "Active"
        );

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidStudent)))
                .andExpect(status().isBadRequest());
    }

    // Test 4: Duplicate email with different casing returns HTTP 409
    @Test
    void shouldRejectDuplicateEmailIgnoringCase() throws Exception {

        createStudent();

        Map<String, Object> duplicate = new java.util.HashMap<>(validStudent());
        duplicate.put("email", "RAHUL@EXAMPLE.COM");

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict());
    }

    // Test 5: Updating a student returns HTTP 200 and persists changes
    @Test
    void shouldUpdateStudent() throws Exception {

        long studentId = createStudent();

        Map<String, Object> updated = new java.util.HashMap<>(validStudent());
        updated.put("fullName", "Rahul Kumar");

        mockMvc.perform(put("/api/students/" + studentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Rahul Kumar"));

        mockMvc.perform(get("/api/students/" + studentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Rahul Kumar"));
    }

    // Test 6: Deleting a student returns HTTP 200
    @Test
    void shouldDeleteStudent() throws Exception {

        long studentId = createStudent();

        mockMvc.perform(delete("/api/students/" + studentId))
                .andExpect(status().isOk());
    }

    // Test 7: Getting a deleted student returns HTTP 404
    @Test
    void shouldReturn404ForDeletedStudent() throws Exception {

        long studentId = createStudent();

        mockMvc.perform(delete("/api/students/" + studentId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/students/" + studentId))
                .andExpect(status().isNotFound());
    }

    // Test 8: Deleting a course with an enrolled student is rejected
    @Test
    void shouldPreventDeletingCourseWithStudents() throws Exception {

        createStudent();

        mockMvc.perform(delete("/api/courses/" + courseId))
                .andExpect(status().isConflict());
    }
}