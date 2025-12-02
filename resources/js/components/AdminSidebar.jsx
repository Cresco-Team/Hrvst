import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { pendingFarmers } = usePage().props;

    const handleApprove = (userId) => {
        if (confirm('Approve this farmer account?')) {
            router.post(route('admin.farmers.approve', userId), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = (userId) => {
        if (confirm('Reject and permanently delete this farmer account? This cannot be undone.')) {
            router.post(route('admin.farmers.reject', userId), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            {/* Collapsed Sidebar - Always Visible Strip */}
            <div
                className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-gray-800 transition-all duration-300 z-30 ${
                    isOpen ? 'w-96' : 'w-12'
                }`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute left-2 top-4 text-white hover:text-gray-300 transition-colors"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {pendingFarmers?.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                                    {pendingFarmers.length}
                                </span>
                            )}
                        </>
                    )}
                </button>

                {/* Expanded Content */}
                {isOpen && (
                    <div className="pt-16 px-4 overflow-y-auto h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Pending Accounts</h2>
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {pendingFarmers?.length || 0}
                            </span>
                        </div>

                        {!pendingFarmers || pendingFarmers.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No pending farmers</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingFarmers.map(farmer => (
                                    <div key={farmer.id} className="bg-gray-700 rounded-lg p-4">
                                        <div className="font-semibold text-white mb-1">{farmer.user.name}</div>
                                        <div className="text-sm text-gray-300 mb-1">{farmer.user.email}</div>
                                        <div className="text-sm text-gray-400 mb-3">
                                            {farmer.municipality.name}, {farmer.barangay.name}
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(farmer.user_id)}
                                                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(farmer.user_id)}
                                                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className={`transition-all duration-300 ${isOpen ? 'w-96' : 'w-12'}`} />
        </>
    );
}