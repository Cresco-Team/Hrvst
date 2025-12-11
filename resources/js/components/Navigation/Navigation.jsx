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
                        <div className="flex space-x-1">
                            <Link href={route('farmers.index')}>
                                <Button variant='ghost'>
                                    Farmers
                                </Button>
                            </Link>
                            <Link href={route('crops.index')}>
                                <Button variant='ghost'>
                                    Crops
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Right - Auth Buttons */}
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <Link href={route('logout')} method="post">
                                <Button variant='outline'>
                                    Sign out
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')}>
                                    <Button variant="outline">
                                        Log in
                                    </Button>
                                </Link>
                                
                                <Link  href={route('register')}>
                                    <Button>
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
