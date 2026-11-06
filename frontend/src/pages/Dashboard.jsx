import { useEffect, useState } from 'react';
import { getStats, getStudents } from '../services/api';
import { Users, UserCheck, UserX, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';

const cards = [
    {
        key: 'totalStudents',
        label: 'Total Students',
        icon: Users,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        lightBg: '#f0f0ff',
        lightText: '#6366f1',
        trend: '+12% this month'
    },
    {
        key: 'activeStudents',
        label: 'Active Students',
        icon: UserCheck,
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        lightBg: '#ecfdf5',
        lightText: '#059669',
        trend: '+8% this month'
    },
    {
        key: 'inactiveStudents',
        label: 'Inactive Students',
        icon: UserX,
        gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
        lightBg: '#fff1f2',
        lightText: '#e11d48',
        trend: '-3% this month'
    },
    {
        key: 'totalCourses',
        label: 'Total Courses',
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        lightBg: '#eff6ff',
        lightText: '#2563eb',
        trend: '+2 this month'
    }
];

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="skeleton h-4 w-28 mb-4 rounded" />
            <div className="skeleton h-10 w-20 mb-3 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
        </div>
    );
}

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
        <div className="fade-in">
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">!</span>
                    </div>
                    <p role="alert">{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {!stats
                    ? cards.map((_, i) => <SkeletonCard key={i} />)
                    : cards.map(card => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.key}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 group overflow-hidden relative"
                                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)' }}
                            >
                                {/* Subtle accent top bar */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                                    style={{ background: card.gradient }}
                                />

                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                            {card.label}
                                        </p>
                                        <h2 className="text-4xl font-extrabold text-slate-800 mb-2 leading-none">
                                            {stats[card.key]}
                                        </h2>
                                        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: card.lightText }}>
                                            <TrendingUp size={11} />
                                            {card.trend}
                                        </div>
                                    </div>
                                    <div
                                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                                        style={{ background: card.gradient, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                    >
                                        <Icon size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {/* Recent Enrollments */}
            <div
                className="bg-white rounded-2xl overflow-hidden border border-slate-100"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)' }}
            >
                {/* Table header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-50">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Recent Enrollments</h2>
                        <p className="text-sm text-slate-400 mt-0.5">The five most recently registered students</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                        <span>View All</span>
                        <ArrowUpRight size={12} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ background: '#fafbfc' }}>
                                {['Student', 'Email', 'Course', 'Enrollment Date', 'Status'].map(h => (
                                    <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentStudents.map((student, i) => (
                                <tr
                                    key={student.id}
                                    className="table-row-hover border-t border-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{
                                                    background: `hsl(${(i * 60 + 200) % 360}, 65%, 55%)`
                                                }}
                                            >
                                                {student.fullName?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-800">{student.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{student.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                                            <BookOpen size={11} />
                                            {student.courseName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{student.enrollmentDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            student.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-orange-50 text-orange-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                student.status === 'Active' ? 'bg-emerald-500' : 'bg-orange-400'
                                            }`} />
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Users size={40} strokeWidth={1} />
                                            <p className="font-medium">No enrollments yet</p>
                                            <p className="text-sm">Students will appear here once they enroll.</p>
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

export default Dashboard;
