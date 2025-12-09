import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';

export default function Navigation() {
    const page = usePage();
    const { auth } = page.props;
    const isHome = page.url === '/';
    const user = auth?.user;

    return (
        <nav className="bg-white border-b border-gray-200 z-50">
            <div className="max-w-full px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <img 
                                src="/assets/hrvst.svg" 
                                alt="Hrvst" 
                                className="w-8 h-8 object-contain"
                            />
                            <span className="text-2xl font-bold text-gray-900">
                                Hrvst
                            </span>
                        </Link>
                    </div>

                    {!isHome && (
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
                    )}

                    {/* Right - Auth Buttons */}
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <Button variant="primary" size="md" href={route('logout')} method="post">
                                Sign out
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" href={route('login')}>
                                    Log in
                                </Button>
                                <Button variant="primary" href={route('register')}>
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
