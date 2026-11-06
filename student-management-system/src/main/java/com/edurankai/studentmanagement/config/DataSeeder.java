package com.edurankai.studentmanagement.config;

import com.edurankai.studentmanagement.entity.Course;
import com.edurankai.studentmanagement.entity.Student;
import com.edurankai.studentmanagement.repository.CourseRepository;
import com.edurankai.studentmanagement.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedInitialData(CourseRepository courseRepository,
                                      StudentRepository studentRepository) {
        return args -> {
            // Only seed a completely empty database. Existing user data is preserved.
            if (courseRepository.count() > 0 || studentRepository.count() > 0) {
                return;
            }

            Course cs101 = new Course("CS101", "Computer Science", "Engineering", 4);
            Course cs102 = new Course("CS102", "Information Science", "Engineering", 4);
            Course ai201 = new Course("AI201", "Artificial Intelligence", "Computer Science", 3);
            Course ds301 = new Course("DS301", "Data Science", "Computer Science", 3);

            courseRepository.saveAll(List.of(cs101, cs102, ai201, ds301));

            LocalDate today = LocalDate.now();
            List<Student> students = List.of(
                    new Student("Aarav Sharma", "aarav.sharma@gmail.com", "9876543210", cs101, today.minusDays(1), "Active"),
                    new Student("Diya Patel", "diya.patel@gmail.com", "9876543211", cs101, today.minusDays(3), "Active"),
                    new Student("Om Verma", "om.verma@gmail.com", "9876543212", cs102, today.minusDays(2), "Active"),
                    new Student("Ananya Gupta", "ananya.gupta@gmail.com", "9876543213", cs102, today.minusDays(4), "Inactive"),
                    new Student("Kabir Mehta", "kabir.mehta@gmail.com", "9876543214", ai201, today.minusDays(5), "Active"),
                    new Student("Isha Reddy", "isha.reddy@gmail.com", "9876543215", ai201, today.minusDays(6), "Active"),
                    new Student("Rohan Das", "rohan.das@gmail.com", "9876543216", ds301, today.minusDays(7), "Inactive"),
                    new Student("Meera Nair", "meera.nair@gmail.com", "9876543217", ds301, today.minusDays(8), "Active")
            );

            studentRepository.saveAll(students);
        };
    }
}