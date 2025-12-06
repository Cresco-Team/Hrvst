import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import BaseMap from '@/Components/Map/BaseMap';
import MapUpdater from '../Map/MapUpdater';
import { Marker } from 'react-leaflet';

export default function AdminPendingPanel() {
    const { pendingFarmers } = usePage().props;
    const [viewLocationFarmer, setViewLocationFarmer] = useState(null)

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

    const handleViewLocation = (farmer) => {
        setViewLocationFarmer(farmer);
    };

    const closeLocationModal = () => {
        setViewLocationFarmer(null);
    }

    return (
        <>
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Pending Accounts</h2>
            </div>

            {!pendingFarmers || pendingFarmers.length === 0 ? (
                <p className="text-gray-300 text-center py-8">No pending farmers</p>
            ) : (
                <div className="space-y-3">
                    {pendingFarmers.map(farmer => ( 
                        <div key={farmer.id} className="bg-gray-200 rounded-lg p-4">
                            <div className="font-semibold text-gray-900 mb-1">
                                {farmer.user.name}
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                                {farmer.barangay.name}, {farmer.municipality.name},
                                Benguet
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewLocation(farmer)}
                                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors font-medium"
                                >
                                    View Location
                                </button>
                                <button
                                    onClick={() => handleApprove(farmer.user_id)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(farmer.user_id)}
                                    className="px-4 py-2 bg-gray-400 text-white text-sm rounded-md hover:bg-red-600 transition-colors font-medium"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Location Modal */}
            {viewLocationFarmer && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4"
                    onClick={closeLocationModal}
                >
                    <div 
                        className="bg-white rounded-lg w-full max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{viewLocationFarmer.user.name}'s Location</h3>
                                    <p className="text-sm text-gray-600">
                                    {viewLocationFarmer.barangay?.name}, {viewLocationFarmer.municipality?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={closeLocationModal}
                                    className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                                <BaseMap
                                    center={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]}
                                    zoom={15}
                                >
                                    <MapUpdater 
                                        center={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]} 
                                        zoom={15} 
                                    />
                                    <Marker 
                                        position={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]} 
                                    />
                                </BaseMap>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={closeLocationModal}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        handleApprove(viewLocationFarmer.user_id);
                                        closeLocationModal();
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                                >
                                    Approve Farmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}