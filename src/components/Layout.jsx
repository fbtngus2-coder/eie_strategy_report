import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenTool, Calendar, Menu, ChevronLeft, Map as MapIcon, LogOut, User, ExternalLink, Megaphone, Archive } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { path: '/', label: '대시보드', icon: <LayoutDashboard size={20} /> },
        { path: '/input', label: '데이터 입력', icon: <PenTool size={20} /> },
        { path: '/strategy', label: '전략 리포트', icon: <Calendar size={20} /> },
        { path: '/marketing', label: '마케팅 공략', icon: <Megaphone size={20} /> },
        { path: '/saved-reports', label: '리포트 보관함', icon: <Archive size={20} /> },
    ];

    // Mobile Sidebar State
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 h-full bg-[#1a1c23] text-white transition-all duration-300 flex flex-col shadow-xl z-30
                    ${isSidebarOpen ? 'md:w-[260px]' : 'md:w-[80px]'}
                    w-[260px] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex absolute -right-3 top-8 bg-[#2d3039] text-gray-400 p-1 rouned-full border border-gray-600 rounded-full hover:text-white transition-colors"
                >
                    {isSidebarOpen ? <ChevronLeft size={14} /> : <Menu size={14} />}
                </button>

                {/* Header / Logo Area */}
                <div className="px-3 py-6 border-b border-gray-800 flex flex-col justify-center min-h-[120px]">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        {isSidebarOpen && (
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="font-bold text-xl leading-tight whitespace-nowrap mb-1">선승구전(先勝求戰)</h1>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 whitespace-nowrap leading-tight">EiE Self-Consulting Program</span>
                                    <span className="text-xs text-gray-400 whitespace-nowrap leading-tight">Winning Before Fighting</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                                    : 'text-gray-400 hover:bg-[#252830] hover:text-white'
                                    }`}
                            >
                                <div className={`${location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && <span className="font-medium tracking-wide">{item.label}</span>}
                            </Link>
                        ))}
                    </div>

                    {/* Separator for mockup items */}
                    <div className="my-6 border-t border-gray-800 mx-2"></div>


                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 bg-[#15171e] border-t border-gray-800">
                    <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                            <User size={18} />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">원장님</p>
                                <p className="text-xs text-gray-500 truncate">EiE Campus</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                            <button className="text-gray-500 hover:text-white">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Bar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-600"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                            </h2>
                            <p className="text-xs text-gray-400 hidden sm:block">Data-Driven Growth Platform</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">
                            Beta Version
                        </div>
                    </div>
                </header>

                {/* Content Wrapper */}
                <div className="flex-1 overflow-auto p-4 md:p-6 scrollbar-hide">
                    <div className="max-w-7xl mx-auto animate-fadeIn">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
