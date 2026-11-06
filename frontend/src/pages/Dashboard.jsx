import { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import { Users, UserCheck, UserX, BookOpen } from 'lucide-react';

const cards = [
    {
        key: 'totalStudents',
        label: 'Total Students',
        icon: Users,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        key: 'activeStudents',
        label: 'Active Students',
        icon: UserCheck,
        color: 'bg-green-100 text-green-600'
    },
    {
        key: 'inactiveStudents',
        label: 'Inactive Students',
        icon: UserX,
        color: 'bg-orange-100 text-orange-600'
    },
    {
        key: 'totalCourses',
        label: 'Total Courses',
        icon: BookOpen,
        color: 'bg-purple-100 text-purple-600'
    }
];

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getStats()
            .then(response => setStats(response.data))
            .catch(() => setError('Unable to load dashboard statistics.'));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800">
                Dashboard
            </h1>
            <p className="text-slate-500 mt-1 mb-6">
                Overview of students and courses.
            </p>

            {error && (
                <p className="text-red-600 mb-4">{error}</p>
            )}

            {!stats ? (
                <p className="text-slate-500">Loading statistics...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {cards.map(card => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.key}
                                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {card.label}
                                        </p>
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
            )}
        </div>
    );
}

export default Dashboard;