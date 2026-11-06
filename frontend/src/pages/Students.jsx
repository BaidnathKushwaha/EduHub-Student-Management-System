import { useEffect, useState } from 'react';
import {
    getStudents,
    getCourses,
    addStudent,
    updateStudent,
    deleteStudent
} from '../services/api';

import StudentModal from '../components/StudentModal';
import { Plus, Pencil, Trash2, Search, Filter, Users, ChevronDown } from 'lucide-react';

function StatusBadge({ status }) {
    const isActive = status === 'Active';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-orange-400'}`} />
            {status}
        </span>
    );
}

function Students() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [courseId, setCourseId] = useState('');
    const [status, setStatus] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loadStudents = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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

    const hasFilters = search || courseId || status;

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                        <Users size={13} />
                        <span>{students.length} records</span>
                    </div>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:shadow-lg hover:-translate-y-px active:translate-y-0"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                    }}
                >
                    <Plus size={17} />
                    Add Student
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-5 text-sm">
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}

            {/* Filters */}
            <div
                className="bg-white rounded-2xl p-4 mb-5 flex flex-wrap gap-3 border border-slate-100"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
                {/* Search */}
                <div className="relative flex-1 min-w-52">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 input-focus focus:outline-none focus:border-indigo-400"
                    />
                </div>

                {/* Course filter */}
                <div className="relative">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className="pl-8 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 input-focus focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                    >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.code}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Status filter */}
                <div className="relative">
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="pl-3.5 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 input-focus focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {hasFilters && (
                    <button
                        onClick={() => { setSearch(''); setCourseId(''); setStatus(''); }}
                        className="px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div
                className="bg-white rounded-2xl overflow-hidden border border-slate-100"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)' }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ background: '#fafbfc' }}>
                                {['Student', 'Email', 'Phone', 'Course', 'Enrolled', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="border-t border-slate-50">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className={`skeleton h-4 rounded ${j === 0 ? 'w-32' : j === 6 ? 'w-14' : 'w-24'}`} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : students.map((student, i) => (
                                <tr key={student.id} className="table-row-hover border-t border-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ background: `hsl(${(i * 67 + 200) % 360}, 60%, 55%)` }}
                                            >
                                                {student.fullName?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-800">{student.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{student.email}</td>
                                    <td className="px-6 py-4 text-slate-500">{student.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                                            {student.courseName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{student.enrollmentDate}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={student.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(student)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-500 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                                                title="Edit student"
                                            >
                                                <Pencil size={14} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                title="Delete student"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && students.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Users size={44} strokeWidth={1} />
                                            <div>
                                                <p className="font-semibold text-slate-500">No students found</p>
                                                <p className="text-sm mt-1">
                                                    {hasFilters ? 'Try adjusting your filters.' : 'Get started by adding a new student.'}
                                                </p>
                                            </div>
                                            {!hasFilters && (
                                                <button
                                                    onClick={openAddModal}
                                                    className="mt-1 flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl"
                                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                                >
                                                    <Plus size={15} />
                                                    Add First Student
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
