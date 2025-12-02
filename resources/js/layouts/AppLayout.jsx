import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children, rightSidebar = null }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left - Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                            <span className="text-2xl font-bold text-gray-800">Hrvst</span>
                        </Link>

                        {/* Center - Navigation Links */}
                        <div className="flex space-x-8">
                            <Link
                                href={route('farmers.index')}
                                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                            >
                                Farmers
                            </Link>
                            <Link
                                href={route('crops.index')}
                                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                            >
                                Crops
                            </Link>
                        </div>

                        {/* Right - Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-600">
                                        {user.name}
                                    </span>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                                    >
                                        Sign out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Right Sidebar (conditionally rendered) */}
                {rightSidebar}
            </div>
        </div>
    );
}