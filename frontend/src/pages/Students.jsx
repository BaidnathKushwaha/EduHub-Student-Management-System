import { useEffect, useState } from 'react';
import {
    getStudents,
    getCourses,
    addStudent,
    updateStudent,
    deleteStudent
} from '../services/api';

import StudentModal from '../components/StudentModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

function Students() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [courseId, setCourseId] = useState('');
    const [status, setStatus] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const loadStudents = async () => {
        try {
            const response = await getStudents({
                search: search || undefined,
                courseId: courseId || undefined,
                status: status || undefined
            });

            setStudents(response.data);
            setError('');
        } catch {
            setError('Unable to load students.');
        }
    };

    const loadCourses = async () => {
        try {
            const response = await getCourses();
            setCourses(response.data);
        } catch {
            setError('Unable to load courses.');
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadStudents();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, courseId, status]);

    const handleSave = async (data) => {
        if (selectedStudent) {
            await updateStudent(selectedStudent.id, data);
        } else {
            await addStudent(data);
        }

        setShowModal(false);
        setSelectedStudent(null);
        await loadStudents();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) {
            return;
        }

        try {
            await deleteStudent(id);
            await loadStudents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to delete student.'
            );
        }
    };

    const openAddModal = () => {
        setSelectedStudent(null);
        setShowModal(true);
    };

    const openEditModal = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Students
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage student enrollment records.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Student
                </button>
            </div>

            {error && (
                <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                    {error}
                </p>
            )}

            <div className="bg-white border rounded-xl p-4 mb-5 flex flex-wrap gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="border rounded-lg p-3 flex-1 min-w-48"
                />

                <select
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    className="border rounded-lg p-3"
                >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.code}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="border rounded-lg p-3"
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <div className="bg-white border rounded-xl overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Enrollment Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-t">
                                <td className="p-4 font-medium">
                                    {student.fullName}
                                </td>
                                <td className="p-4">{student.email}</td>
                                <td className="p-4">{student.phoneNumber}</td>
                                <td className="p-4">{student.courseName}</td>
                                <td className="p-4">{student.enrollmentDate}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        student.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => openEditModal(student)}
                                            className="text-blue-600"
                                            title="Edit student"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="text-red-600"
                                            title="Delete student"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {students.length === 0 && (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-slate-500">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <StudentModal
                    student={selectedStudent}
                    courses={courses}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

export default Students;