import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';

export default function Pending() {
    const handleGoHome = () => {
        router.get('/');
    };

    return (
        <GuestLayout>
            <Head title="Account Pending Approval" />

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <svg 
                                className="w-8 h-8 text-yellow-600" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Account Pending Approval
                        </h2>
                        <p className="text-gray-600">
                            Your farmer account has been submitted and is awaiting administrator approval. 
                            You will be able to access your account once it has been reviewed and approved.
                        </p>
                    </div>

                    <button
                        onClick={handleGoHome}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                        Return to Home
                    </button>

                    <p className="mt-4 text-sm text-gray-500">
                        This process typically takes 1-2 business days
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}