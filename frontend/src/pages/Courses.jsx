import { useEffect, useState } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../services/api';
import { Plus, Trash2, Pencil, BookOpen, X, ChevronDown, Users } from 'lucide-react';

const emptyForm = {
    code: '',
    name: '',
    department: '',
    creditHours: 3
};

const departmentColors = {
    'Computer Science': 'bg-indigo-100 text-indigo-700',
    'Mathematics': 'bg-purple-100 text-purple-700',
    'Physics': 'bg-blue-100 text-blue-700',
    'Chemistry': 'bg-teal-100 text-teal-700',
    'Engineering': 'bg-orange-100 text-orange-700',
};

function getDeptColor(dept) {
    return departmentColors[dept] || 'bg-slate-100 text-slate-700';
}

function FormField({ label, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

function Courses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {
        setForm(emptyForm);
        setEditingCourseId(null);
        setError('');
        setShowForm(true);
    };

    const openEditForm = (course) => {
        setForm({
            code: course.code,
            name: course.name,
            department: course.department,
            creditHours: course.creditHours
        });
        setEditingCourseId(course.id);
        setError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCourseId(null);
        setForm(emptyForm);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const courseData = {
            ...form,
            code: form.code.trim(),
            name: form.name.trim(),
            department: form.department.trim(),
            creditHours: Number(form.creditHours)
        };

        try {
            if (editingCourseId !== null) {
                await updateCourse(editingCourseId, courseData);
            } else {
                await addCourse(courseData);
            }

            closeForm();
            await loadCourses();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                (editingCourseId !== null
                    ? 'Unable to update course. Check the entered details.'
                    : 'Unable to add course. Check the entered details.')
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        setError('');

        try {
            await deleteCourse(id);
            await loadCourses();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Unable to delete this course.'
            );
        }
    };

    const inputClass = "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 input-focus focus:outline-none focus:border-indigo-400";

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <BookOpen size={13} />
                    <span>{courses.length} courses</span>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:shadow-lg hover:-translate-y-px active:translate-y-0"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                    }}
                >
                    <Plus size={17} />
                    Add Course
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-5 text-sm">
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}

            {/* Inline Form */}
            {showForm && (
                <div
                    className="bg-white rounded-2xl border border-indigo-100 mb-6 overflow-hidden fade-in"
                    style={{ boxShadow: '0 4px 24px rgba(99, 102, 241, 0.1)' }}
                >
                    {/* Form header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
                         style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))' }}>
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                            >
                                <BookOpen size={15} className="text-white" />
                            </div>
                            <h2 className="text-base font-bold text-slate-800">
                                {editingCourseId !== null ? 'Edit Course' : 'New Course'}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Course Code">
                            <input
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="e.g. CS101"
                                maxLength="30"
                                required
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Course Name">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Introduction to Programming"
                                maxLength="120"
                                required
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Department">
                            <input
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                                maxLength="80"
                                required
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Credit Hours">
                            <div className="relative">
                                <input
                                    name="creditHours"
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={form.creditHours}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </FormField>

                        <div className="md:col-span-2 flex gap-3 pt-2">
                            <button
                                disabled={loading}
                                className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-all hover:shadow-md"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : editingCourseId !== null ? 'Save Changes' : 'Save Course'}
                            </button>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div
                className="bg-white rounded-2xl overflow-hidden border border-slate-100"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)' }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ background: '#fafbfc' }}>
                                {['Code', 'Course Name', 'Department', 'Credits', 'Students', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="table-row-hover border-t border-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg font-mono">
                                            {course.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">{course.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDeptColor(course.department)}`}>
                                            {course.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: Math.min(course.creditHours, 6) }).map((_, i) => (
                                                    <div key={i} className="w-1.5 h-3 rounded-sm" style={{ background: '#6366f1', opacity: 0.4 + (i * 0.1) }} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{course.creditHours}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Users size={13} className="text-slate-400" />
                                            <span className="font-semibold">{course.enrolledStudents ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditForm(course)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-500 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                                                title="Edit course"
                                                aria-label={`Edit ${course.name}`}
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                title="Delete course"
                                                aria-label={`Delete ${course.name}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <BookOpen size={44} strokeWidth={1} />
                                            <div>
                                                <p className="font-semibold text-slate-500">No courses yet</p>
                                                <p className="text-sm mt-1">Start by adding your first course to the catalog.</p>
                                            </div>
                                            <button
                                                onClick={openAddForm}
                                                className="mt-1 flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                            >
                                                <Plus size={15} />
                                                Add First Course
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Courses;
