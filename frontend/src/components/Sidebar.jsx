import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';

const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/courses', label: 'Courses', icon: BookOpen }
];

function Sidebar() {
    return (
        <aside className="w-60 bg-slate-900 text-white min-h-screen p-5">
            <h1 className="text-xl font-bold mb-10">
                EduRankAI
            </h1>

            <nav className="space-y-2">
                {links.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg
                            ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800'}`
                        }
                    >
                        <Icon size={19} />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;