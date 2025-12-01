import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <div className="bg-white font-sans">
            
            {/* Navbar */}
            <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                {/* Note: In a real React app, you'd import the image or use a public path */}
                <img src="/mnt/data/Harvest_Image_Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-semibold">HrvsT</span>
                </div>
                <div className="space-x-4">
                <Link href={route('login')} 
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 inline-block">
                    Log in
                </Link>
                <Link href={route('register')} 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block">
                    Register
                </Link>
                
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-green-100 py-24 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
                <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-700">
                    Crop Prices Updates
                    <span className="text-green-600 block">from Trading Post</span>
                </h1>
                <p className="mt-4 text-gray-600 text-sm">
                    All information is provided by the Benguet Trading Post Cooperatives
                </p>
                </div>

                <div className="mt-10 md:mt-0">
                <div className="w-64 h-48 bg-green-500 rounded-lg flex items-center justify-center">
                    <img src="/mnt/data/Harvest_Image_Logo.png" alt="Preview" className="w-32 h-24 opacity-80" />
                </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-gray-300 py-16 px-6 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Logo */}
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                    <img src="/mnt/data/Harvest_Image_Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-lg font-semibold text-white">HrvsT</span>
                    </div>

                    <p className="text-sm">
                    Copyright &copy; 2020 Nexcent ltd.<br />
                    All rights reserved
                    </p>

                    <div className="flex space-x-4 mt-4">
                    <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                    </div>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm">
                    <li>About us</li>
                    <li>Blog</li>
                    <li>Contact us</li>
                    <li>Pricing</li>
                    <li>Testimonials</li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                    <li>Help center</li>
                    <li>Terms of service</li>
                    <li>Legal</li>
                    <li>Privacy policy</li>
                    <li>Status</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Stay up to date</h3>
                    <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
                    <input type="email" placeholder="Your email address" className="bg-gray-800 text-sm w-full outline-none text-gray-300" />
                    {/* This SVG is a self-closing tag and needs to be closed with '/>' */}
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.94 2.94a1.5 1.5 0 012.12 0L10 7.88l4.94-4.94a1.5 1.5 0 112.12 2.12L12.12 10l4.94 4.94a1.5 1.5 0 01-2.12 2.12L10 12.12l-4.94 4.94a1.5 1.5 0 01-2.12-2.12L7.88 10 2.94 5.06a1.5 1.5 0 010-2.12z" />
                    </svg>
                    </div>
                </div>

                </div>
            </footer>
            </div>
        </>
    );
}
