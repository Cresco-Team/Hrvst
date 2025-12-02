// Floating Top Bar

import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function TopBar({ onMobileMenuToggle }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Logo */}
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onMobileMenuToggle}
                            className="md:hidden mr-3 text-gray-600 hover:text-green-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center space-x-2">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                            <span className="text-2xl font-bold text-gray-800">Hrvst</span>
                        </Link>
                    </div>

                    {/* Center - Navigation Links */}
                    <div className="hidden md:flex space-x-8">
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
                                <span className="hidden sm:inline text-sm text-gray-600">
                                    {user.name}
                                </span>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-medium"
                                >
                                    Sign out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors text-sm"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}