import { useLocation } from 'react-router-dom';
import { Bell, Search, GraduationCap } from 'lucide-react';

const pageTitles = {
    '/': { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening today.' },
    '/students': { title: 'Students', subtitle: 'Manage and track all student enrollments.' },
    '/courses': { title: 'Courses', subtitle: 'Browse and manage the course catalog.' }
};

function Navbar() {
    const location = useLocation();
    const page = pageTitles[location.pathname] || pageTitles['/'];
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <header
            className="sticky top-0 z-30 px-6 lg:px-8 py-4"
            style={{
                background: 'rgba(241, 245, 249, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
            }}
        >
            <div className="flex justify-between items-center gap-4">
                {/* Page title area */}
                <div className="flex items-center gap-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 lg:hidden"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">
                            {page.title}
                        </h2>
                        <p className="text-xs text-slate-400 leading-tight mt-0.5 hidden sm:block">
                            {page.subtitle}
                        </p>
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3">
                    {/* Date pill */}
                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5"
                         style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {dateStr}
                    </div>

                    {/* Notification bell */}
                    <button
                        className="relative w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        title="Notifications"
                    >
                        <Bell size={16} />
                        <span
                            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                            style={{ background: '#6366f1' }}
                        />
                    </button>

                    {/* Avatar */}
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)'
                            }}
                        >
                            A
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700 leading-tight">Administrator</p>
                            <p className="text-xs text-slate-400 leading-tight">admin@eduhub.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
