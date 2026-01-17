import { Link } from "@inertiajs/react"
import { Button } from "../ui/button"


const HomeNav = ({ auth }) => {
    return (
        <header className='bg-background sticky top-0 z-50 w-full flex justify-between items-center border-b py-2 px-10'>
            <nav>
                <Link
                    className='flex items-center gap-2'
                    href={route('home')}
                >
                    <img
                        src="assets/hrvst.svg"
                        alt="Hrvst.inc"
                        className='h-10 aspect-square object-contain'
                    />
                    <p className='text-xs flex flex-col'>
                        <span className='text-lg font-bold'>
                            Hrvst.inc
                        </span>
                        Powered by team Cresco
                    </p>
                </Link>
            </nav>

            {auth?.user && (
                <nav>
                    <Link
                        href={route('logout')}
                        method="post"
                    >
                        <Button size='lg' className='cursor-pointer'>
                            Logout
                        </Button>
                    </Link>
                </nav>
            )}

            {!auth.user && (
                <nav className='flex justify-between gap-4'>
                    <Link
                        href={route('login')}
                    >
                        <Button size='lg' variant='outline' className='cursor-pointer'>
                            Login
                        </Button>
                    </Link>

                    <Link
                        href={route('register')}
                    >
                        <Button size='lg' className='cursor-pointer'>
                            Register
                        </Button>
                    </Link>
                </nav>
            )}
        </header>
    )
}

export default HomeNav