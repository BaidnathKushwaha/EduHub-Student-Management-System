import { useEffect, useState } from 'react';
import { getStats, getStudents } from '../services/api';
import { Users, UserCheck, UserX, BookOpen } from 'lucide-react';

const cards = [
    { key: 'totalStudents', label: 'Total Students', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { key: 'activeStudents', label: 'Active Students', icon: UserCheck, color: 'bg-green-100 text-green-600' },
    { key: 'inactiveStudents', label: 'Inactive Students', icon: UserX, color: 'bg-orange-100 text-orange-600' },
    { key: 'totalCourses', label: 'Total Courses', icon: BookOpen, color: 'bg-purple-100 text-purple-600' }
];

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentStudents, setRecentStudents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsResponse, studentsResponse] = await Promise.all([
                    getStats(),
                    getStudents()
                ]);
                setStats(statsResponse.data);
                setRecentStudents(studentsResponse.data.slice(0, 5));
            } catch {
                setError('Unable to load dashboard data. Please refresh the page.');
            }
        };

        loadDashboard();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1 mb-6">
                Overview of students and courses.
            </p>

            {error && (
                <p role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                    {error}
                </p>
            )}

            {!stats ? (
                <p className="text-slate-500">Loading dashboard...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {cards.map(card => {
                            const Icon = card.icon;
                            return (
                                <div key={card.key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-slate-500">{card.label}</p>
                                            <h2 className="text-3xl font-bold mt-2 text-slate-800">
                                                {stats[card.key]}
                                            </h2>
                                        </div>
                                        <div className={`p-3 rounded-xl ${card.color}`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <section className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">Recent Enrollments</h2>
                            <p className="text-sm text-slate-500 mt-1">The five most recently registered students.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="p-4">Student</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Course</th>
                                        <th className="p-4">Enrollment Date</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentStudents.map(student => (
                                        <tr key={student.id} className="border-t">
                                            <td className="p-4 font-medium text-slate-800">{student.fullName}</td>
                                            <td className="p-4 text-slate-600">{student.email}</td>
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
                                        </tr>
                                    ))}
                                    {recentStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-6 text-center text-slate-500">
                                                No enrollments yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default Dashboard;