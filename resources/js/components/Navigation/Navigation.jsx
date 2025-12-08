import { Link, usePage } from '@inertiajs/react';
import Button from '@/Components/Buttons/Button';

export default function Navigation({ onMobileMenuToggle }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-full px-12">
                <div className="flex justify-between items-center h-12">
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
                            <img 
                                src="/assets/hrvst.svg" 
                                alt="Hrvst" 
                                className="w-8 h-8 object-contain"
                            />
                            <span className="text-2xl font-bold text-gray-900">Hrvst</span>
                        </Link>
                    </div>

                    {/* Center - Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        <Link
                            href={route('farmers.index')}
                            className="text-gray-700 hover:text-green-600 font-medium transition-colors text-base"
                        >
                            Farmers
                        </Link>
                        <Link
                            href={route('crops.index')}
                            className="text-gray-700 hover:text-green-600 font-medium transition-colors text-base"
                        >
                            Crops
                        </Link>
                    </div>

                    {/* Right - Auth Buttons */}
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <Button variant="primary" size="md" href={route('logout')} method="post">
                                Sign out
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" size="md" href={route('login')}>
                                    Log in
                                </Button>
                                <Button variant="primary" size="md" href={route('register')}>
                                    Sign up
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}