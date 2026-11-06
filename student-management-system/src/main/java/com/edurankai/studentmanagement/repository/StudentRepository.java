
package com.edurankai.studentmanagement.repository;

import com.edurankai.studentmanagement.dto.StudentStatsResponse;
import com.edurankai.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByCourse_Id(Long courseId);

    long countByCourse_Id(Long courseId);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("""
        SELECT s FROM Student s
        WHERE
            (:search IS NULL OR
                LOWER(s.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:courseId IS NULL OR s.course.id = :courseId)
            AND (:status IS NULL OR s.status = :status)
        ORDER BY s.id DESC
        """)
    List<Student> searchStudents(
            @Param("search") String search,
            @Param("courseId") Long courseId,
            @Param("status") String status
    );


    @Query("""
    SELECT new com.edurankai.studentmanagement.dto.StudentStatsResponse(
        COUNT(s),
        COALESCE(SUM(
            CASE WHEN s.status = 'Active' THEN 1 ELSE 0 END
        ), 0),
        COALESCE(SUM(
            CASE WHEN s.status = 'Inactive' THEN 1 ELSE 0 END
        ), 0)
    )
    FROM Student s
    """)
    StudentStatsResponse getStudentStatistics();

}
