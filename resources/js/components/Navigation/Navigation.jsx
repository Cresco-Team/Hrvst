import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { MapPinned } from 'lucide-react';
import { ChartCandlestick } from 'lucide-react';

export default function Navigation() {
    const {props, url} = usePage();
    const { auth } = props;
    const isHome = url === '/';
    const user = auth?.user;

    return (
        <header className="w-full bg-white border-b border z-10">
            {/* Top Navigation */}
            <nav className="max-w-full px-6 flex justify-between items-center h-12 md:h-16">
                {/* Left - Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <img className="w-6 md:w-8 h-8 object-contain"
                            src="/assets/hrvst.svg" 
                            alt="Hrvst"
                        /> <span className="text-lg md:text-2xl font-bold text-gray-900 md:">Hrvst</span>
                    </Link>
                </div>

                {/* Center (Desktop) */}
                {!isHome && (
                    <div className="hidden md:flex space-x-1">
                        <Link href={route('farmers.index')}>
                            <Button variant='ghost'>Farmers</Button>
                        </Link>
                        <Link href={route('crops.index')}>
                            <Button variant='ghost'>Crops</Button>
                        </Link>
                    </div>
                )}

                {/* Right - Auth Buttons */}
                <div className="flex items-center space-x-3">
                    {user ? (
                        <Link href={route('logout')} method="post">
                            <Button variant='outline'>Sign out</Button>
                        </Link>
                    ) : (<>
                        <Link href={route('login')}>
                            <Button variant="outline">Log in</Button>
                        </Link>
                        
                        <Link href={route('register')}>
                            <Button>Sign up</Button>
                        </Link>
                    </>)}
                </div>
            </nav>

            {/* Mobile Navigation */}
            
            {!isHome && (
                <div className='md:hidden border-t gap-2 bg-sidebar'>
                    <div className="flex w-full justify-center text-center">
                        <Link href={route('farmers.index')} className={` flex-1 py-2 border-b-4 ${
                            url.startsWith('/farmers') ? 'border-primary' : 'border-r-transparent'
                        }`}>
                            <Button variant='link' size='sm' className='h-0 text-sidebar-primary'><MapPinned/>Farmers</Button>
                        </Link>
                        <Link href={route('crops.index')} className={`flex-1 py-2 border-b-4 ${
                            url.startsWith('/crops') ? 'border-primary' : 'border-r-transparent'
                        }`}>
                            <Button variant='link' size='sm' className='h-0 text-sidebar-primary'><ChartCandlestick/>Crops</Button>
                        </Link>
                    </div>
                </div>
            )}
            
        </header>
    );
}
