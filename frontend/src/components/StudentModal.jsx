import { useEffect, useState } from 'react';
import { X, User, Mail, Phone, BookOpen, Calendar, Activity } from 'lucide-react';

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

function FormField({ label, icon: Icon, children }) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {Icon && <Icon size={12} />}
                {label}
            </label>
            {children}
        </div>
    );
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

    const inputClass = "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50 modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl fade-in overflow-hidden"
                style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}
            >
                {/* Modal header */}
                <div
                    className="px-6 py-5 flex items-center justify-between border-b border-slate-100"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.03))' }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            <User size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">
                                {student ? 'Edit Student' : 'Add New Student'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {student ? 'Update student information' : 'Fill in the details to register a student'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-6 mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-red-600 font-bold text-xs">!</span>
                        </div>
                        <p role="alert">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <FormField label="Full Name" icon={User}>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Jane Smith"
                            minLength="2"
                            maxLength="100"
                            required
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Email Address" icon={Mail}>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="e.g. jane@example.com"
                            required
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Phone Number" icon={Phone}>
                        <input
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210"
                            pattern="[0-9]{7,16}"
                            required
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Course" icon={BookOpen}>
                        <select
                            name="courseId"
                            value={form.courseId}
                            onChange={handleChange}
                            required
                            className={inputClass + " cursor-pointer"}
                        >
                            <option value="">Select a course...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.code} — {course.name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Enrollment Date" icon={Calendar}>
                            <input
                                type="date"
                                name="enrollmentDate"
                                value={form.enrollmentDate}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Status" icon={Activity}>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={inputClass + " cursor-pointer"}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </FormField>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={saving}
                            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-all hover:shadow-md"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : student ? 'Save Changes' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentModal;
