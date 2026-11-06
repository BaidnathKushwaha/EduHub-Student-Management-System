function Navbar() {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-slate-800">
                        Student Management System
                    </h2>
                    <p className="text-sm text-slate-500">
                        EduRankAI Administration
                    </p>
                </div>

                <div className="text-sm font-medium text-slate-600">
                    Administrator
                </div>
            </div>
        </header>
    );
}

export default Navbar;