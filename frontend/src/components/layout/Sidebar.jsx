import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    MessageSquare,
    Target,
    FileSignature,
    LogOut,
    Sun,
    Moon,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/scanner', label: 'ATS Scanner', icon: FileText },
        { path: '/job-match', label: 'Job Matches', icon: Briefcase },
        { path: '/career-paths', label: 'Career Paths', icon: Target },
        { path: '/skill-gap', label: 'Skill Analysis', icon: Target },
        { path: '/interview-prep', label: 'Interview Prep', icon: MessageSquare },
        { path: '/cover-letter', label: 'Cover Letter', icon: FileSignature },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background dark:bg-gray-900 duration-300 transition-colors w-full">
            {/* Sidebar Desktop */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white md:hidden"
            >
                {isSidebarOpen ? "✕" : "☰"}
            </button>
            <aside className={`
    fixed top-0 left-0 h-full w-64 z-40
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:flex
    flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
`}>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            VetNexara
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary dark:text-blue-400 dark:bg-gray-700'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === 'dark' ? (
                            <><Sun className="w-5 h-5 mr-3 text-yellow-500" /> Light Mode</>
                        ) : (
                            <><Moon className="w-5 h-5 mr-3 text-gray-500" /> Dark Mode</>
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="p-6 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Sidebar;
