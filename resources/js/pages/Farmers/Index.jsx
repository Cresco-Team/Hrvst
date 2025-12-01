import AuthenticatedLayout from '@/Layouts/BaseLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Index({ farmers }) {
    const [viewLocationFarmer, setViewLocationFarmer] = useState(null);
    const [viewDetailFarmer, setViewDetailFarmer] = useState(null);

    const getMapCenterAndZoom = () => {
        if (farmers.length === 0) return { center: [16.4, 120.6], zoom: 10 };
        const avgLat = farmers.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / farmers.length;
        const avgLng = farmers.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / farmers.length;
        return { center: [avgLat, avgLng], zoom: 12 };
    };
    const { center, zoom } = getMapCenterAndZoom();

    useEffect(() => {
        const handler = (e) => setViewLocationFarmer(e.detail);
        window.addEventListener('view-pending-farmer-location', handler);
        return () => window.removeEventListener('view-pending-farmer-location', handler);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Farmers" />
            <div className="w-full h-[calc(100vh-64px)]">
                <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} key={`${center[0]}-${center[1]}-${zoom}`}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {farmers.map(farmer => (
                        <Marker key={farmer.id} position={[parseFloat(farmer.latitude), parseFloat(farmer.longitude)]} eventHandlers={{ click: () => setViewDetailFarmer(farmer) }}>
                            <Popup>
                                <div className="text-center">
                                    <strong>{farmer.user.name}</strong>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {viewLocationFarmer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{viewLocationFarmer.user.name}'s Location</h3>
                            <button onClick={() => setViewLocationFarmer(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="h-96">
                            <MapContainer center={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]}>
                                    <Popup>{viewLocationFarmer.user.name}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}

            {viewDetailFarmer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Farmer Details</h3>
                            <button onClick={() => setViewDetailFarmer(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Name</label>
                                <p className="text-gray-800">{viewDetailFarmer.user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-gray-800">{viewDetailFarmer.phone_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Address</label>
                                <p className="text-gray-800">{viewDetailFarmer?.barangay?.name}, {viewDetailFarmer?.municipality?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
