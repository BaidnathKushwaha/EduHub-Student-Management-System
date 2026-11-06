import { useEffect, useState } from 'react';

const initialForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    courseId: '',
    enrollmentDate: '',
    status: 'Active'
};

function getErrorMessage(err) {
    const data = err.response?.data;

    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.message === 'string') return data.message;

    if (data && typeof data === 'object') {
        const messages = Object.values(data).filter(value => typeof value === 'string');
        if (messages.length) return messages.join('. ');
    }

    if (err.response?.status === 409) return 'A student with this email already exists.';
    if (err.response?.status === 400) return 'Please check the entered student details.';
    return 'Unable to save student details. Please try again.';
}

function StudentModal({ student, courses, onClose, onSave }) {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (student) {
            setForm({
                fullName: student.fullName,
                email: student.email,
                phoneNumber: student.phoneNumber,
                courseId: String(student.courseId),
                enrollmentDate: student.enrollmentDate,
                status: student.status
            });
        } else {
            setForm(initialForm);
        }
    }, [student]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSave({
                ...form,
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                courseId: Number(form.courseId)
            });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-xl p-6">
                <h2 className="text-xl font-bold mb-5">
                    {student ? 'Edit Student' : 'Add Student'}
                </h2>

                {error && (
                    <p role="alert" className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="fullName" value={form.fullName} onChange={handleChange}
                        placeholder="Full name" minLength="2" maxLength="100" required
                        className="w-full border rounded-lg p-3" />

                    <input name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="Email address" required
                        className="w-full border rounded-lg p-3" />

                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                        placeholder="Phone number" pattern="[0-9]{7,16}" required
                        className="w-full border rounded-lg p-3" />

                    <select name="courseId" value={form.courseId} onChange={handleChange}
                        required className="w-full border rounded-lg p-3">
                        <option value="">Select course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.name}
                            </option>
                        ))}
                    </select>

                    <input type="date" name="enrollmentDate" value={form.enrollmentDate}
                        onChange={handleChange} required className="w-full border rounded-lg p-3" />

                    <select name="status" value={form.status} onChange={handleChange}
                        className="w-full border rounded-lg p-3">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="border rounded-lg px-4 py-2">
                            Cancel
                        </button>
                        <button disabled={saving}
                            className="bg-blue-600 text-white rounded-lg px-5 py-2 disabled:opacity-50">
                            {saving ? 'Saving...' : student ? 'Save Changes' : 'Save Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentModal;