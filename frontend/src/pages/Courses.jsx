import { useEffect, useState } from 'react';
import { getCourses, addCourse, deleteCourse } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const emptyForm = {
    code: '',
    name: '',
    department: '',
    creditHours: 3
};

function Courses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await addCourse({
                ...form,
                creditHours: Number(form.creditHours)
            });

            setForm(emptyForm);
            setShowForm(false);
            await loadCourses();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to add course. Check the entered details.'
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
                'Unable to delete this course.'
            );
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Courses
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage available courses.
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Course
                </button>
            </div>

            {error && (
                <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                    {error}
                </p>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="Course code"
                        maxLength="30"
                        required
                        className="border rounded-lg p-3"
                    />

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Course name"
                        maxLength="120"
                        required
                        className="border rounded-lg p-3"
                    />

                    <input
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="Department"
                        maxLength="80"
                        required
                        className="border rounded-lg p-3"
                    />

                    <input
                        name="creditHours"
                        type="number"
                        min="1"
                        max="12"
                        value={form.creditHours}
                        onChange={handleChange}
                        required
                        className="border rounded-lg p-3"
                    />

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Course'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="border px-5 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white border rounded-xl overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Course Name</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Credits</th>
                            <th className="p-4">Students</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id} className="border-t">
                                <td className="p-4 font-medium">
                                    {course.code}
                                </td>
                                <td className="p-4">{course.name}</td>
                                <td className="p-4">{course.department}</td>
                                <td className="p-4">{course.creditHours}</td>
                                <td className="p-4">
                                    {course.enrolledStudents}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete course"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {courses.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-slate-500">
                                    No courses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Courses;