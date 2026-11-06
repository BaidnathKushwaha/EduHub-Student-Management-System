import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & stats' },
    { path: '/students', label: 'Students', icon: Users, description: 'Manage enrollments' },
    { path: '/courses', label: 'Courses', icon: BookOpen, description: 'Course catalog' }
];

function Sidebar() {
    return (
        <aside
            className="w-64 min-h-screen flex flex-col"
            style={{
                background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
            }}
        >
            {/* Logo */}
            <div className="px-6 py-7 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-base leading-tight tracking-tight">
                            EduHub
                        </h1>
                        <p className="text-xs font-medium" style={{ color: '#6366f1' }}>
                            Admin Portal
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: '#475569' }}>
                    Main Menu
                </p>
                {links.map(({ path, label, icon: Icon, description }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                        style={({ isActive }) =>
                            isActive
                                ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)' }
                                : {}
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                                        style={{ background: '#6366f1' }}
                                    />
                                )}
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                        isActive ? '' : 'group-hover:bg-white/10'
                                    }`}
                                    style={isActive ? { background: 'rgba(99,102,241,0.3)' } : {}}
                                >
                                    <Icon size={16} className={isActive ? 'text-indigo-400' : ''} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-tight">{label}</p>
                                    <p className="text-xs opacity-60 leading-tight mt-0.5 truncate">{description}</p>
                                </div>
                                {isActive && (
                                    <ChevronRight size={14} className="text-indigo-400 opacity-70" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white leading-tight">Administrator</p>
                        <p className="text-xs text-slate-500 leading-tight">System Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
