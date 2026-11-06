# EduRankAI Student Management & Enrollment System

A full-stack application for managing courses and student enrollments. It includes a React dashboard, student and course management screens, REST APIs, relational data integrity, and automated backend integration tests.

## Features

### Dashboard
- Overview of total students, active students, inactive students, and courses.
- Recent enrollment list.

### Student Management
- Create, view, update, and delete student records.
- Search by student name or email.
- Filter by course and enrollment status.
- Validate names, email addresses, phone numbers, enrollment dates, and status.
- Prevent duplicate email addresses regardless of letter casing.
- Display clear validation and conflict errors.

### Course Management
- Create, view, update, and delete courses.
- Display the number of students enrolled in each course.
- Validate course code, name, department, and credit hours.
- Prevent deletion of a course while student records reference it.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Java 21, Spring Boot |
| Persistence | Spring Data JPA, Hibernate |
| Runtime database | MySQL 8 |
| Test database | H2 in-memory, MySQL compatibility mode |
| Validation | Jakarta Bean Validation |
| Testing | JUnit 5, Spring MockMvc |
| Build | Maven |

## Architecture

The backend uses a simple layered structure:

```text
React Frontend
     |
     | HTTP / JSON
     v
Spring Boot REST Controllers
     |
     v
Service Layer
     |
     v
Spring Data JPA Repositories
     |
     v
MySQL Database
```

Controllers expose the API endpoints, services enforce business rules, repositories handle persistence, and DTOs define request and response payloads.

## Database Design

### courses

| Column | Description |
|---|---|
| id | Primary key |
| code | Required, unique, maximum 30 characters |
| name | Required, maximum 120 characters |
| department | Required, maximum 80 characters |
| credit_hours | Required, default 3, allowed range 1–12 |

### students

| Column | Description |
|---|---|
| id | Primary key |
| full_name | Required, 2–100 characters |
| email | Required and unique, case-insensitive |
| phone_number | Required, 7–16 digits |
| course_id | Required foreign key referencing courses.id |
| enrollment_date | Required date |
| status | Active or Inactive |

A course can have multiple students, while each student is associated with one current course. The course foreign key uses restrictive deletion behavior. A course cannot be deleted while student records reference it, including inactive students.

Email addresses are normalized before persistence and protected by a database uniqueness constraint. Duplicate email submissions return HTTP 409 Conflict.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/courses` | List courses |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/{id}` | Update a course |
| DELETE | `/api/courses/{id}` | Delete a course when unused |
| GET | `/api/students` | List/search/filter students |
| POST | `/api/students` | Enroll a student |
| GET | `/api/students/{id}` | Get a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

### HTTP response behavior

- `200 OK`: successful reads and updates; student deletion returns a success response.
- `201 Created`: successful course or student creation.
- `204 No Content`: successful course deletion.
- `400 Bad Request`: invalid input.
- `404 Not Found`: requested record does not exist.
- `409 Conflict`: duplicate email or attempt to delete a course that is still assigned to students.

## Prerequisites

Install the following before running the project:

- Java 21
- MySQL 8
- Node.js and npm
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/BaidnathKushwaha/EduHub-Student-Management-System.git
cd EduHub-Student-Management-System
```

### 2. Create the MySQL database

Open MySQL and run:

```sql
CREATE DATABASE edurankai_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

The backend reads the database password from the `DB_PASSWORD` environment variable. It does not require the password to be committed to the repository.

**Windows PowerShell:**

```powershell
$env:DB_PASSWORD="your_mysql_password"
```

**Linux/macOS:**

```bash
export DB_PASSWORD="your_mysql_password"
```

### 3. Run the backend

Open a terminal in the repository root:

**Windows PowerShell:**

```powershell
cd student-management-system
.\mvnw.cmd spring-boot:run
```

**Linux/macOS:**

```bash
cd student-management-system
./mvnw spring-boot:run
```

The backend starts at `http://localhost:8080`.

### 4. Run the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server is available at `http://localhost:5173`.

## Running Automated Tests

The backend test configuration uses an H2 in-memory database in MySQL compatibility mode. Tests do not need a running MySQL server or local database credentials, and test data is isolated from the normal MySQL database.

**Windows PowerShell:**

```powershell
cd student-management-system
.\mvnw.cmd clean test
```

**Linux/macOS:**

```bash
cd student-management-system
./mvnw clean test
```

The `StudentManagementIntegrationTest` suite covers eight required integration scenarios:

1. Read seeded course data.
2. Create a valid student enrollment.
3. Reject invalid student input.
4. Reject duplicate email addresses submitted with alternate casing.
5. Update a student and verify persistence.
6. Delete a student successfully.
7. Return not found when retrieving a deleted student.
8. Prevent deletion of a course that still has an assigned student.

**Latest recorded result:** all eight integration tests passed using the H2 test configuration.

## Sample Data

On a completely empty database, the application seeds four sample courses and eight sample students. The seeder only runs when both the course and student tables are empty. It does not overwrite or partially populate a database that already contains records.

## Project Structure

```text
EduHub-Student-Management-System/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── student-management-system/
    ├── src/
    │   ├── main/
    │   │   ├── java/com/edurankai/studentmanagement/
    │   │   └── resources/
    │   └── test/
    │       ├── java/
    │       └── resources/
    ├── pom.xml
    └── mvnw
```

## Engineering Decisions

- A layered monolithic backend was chosen to keep the application straightforward and maintainable for its scope.
- MySQL provides persistent local application storage.
- H2 provides isolated, zero-configuration automated testing.
- Database constraints back up service-level checks for uniqueness and referential integrity.
- Centralized exception handling keeps API error responses consistent.

## Candidate

**Baidnath Kushwaha**

Repository: https://github.com/BaidnathKushwaha/EduHub-Student-Management-System
