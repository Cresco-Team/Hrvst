import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, Leaf } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function BaseLayout({ header, children, showLeftSidebar = true }) {
    const page = usePage();
    const user = page?.props?.auth?.user;
    const currentUrl = page?.url || '';

    const [isRightOpen, setIsRightOpen] = useState(false);
    const [selectedMunicipality, setSelectedMunicipality] = useState(page?.props?.filters?.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(page?.props?.filters?.barangay_id || '');

    const municipalities = page?.props?.municipalities || [];
    const allBarangays = page?.props?.barangays || [];

    const barangaysForSelected = useMemo(() => {
        if (!selectedMunicipality) return [];
        return allBarangays.filter(b => String(b.municipality_id) === String(selectedMunicipality));
    }, [allBarangays, selectedMunicipality]);

    const isFarmers = currentUrl.startsWith('/farmers') || currentUrl.includes('admin/farmers');
    const isCrops = currentUrl.startsWith('/crops') || currentUrl.includes('admin/crops');

    useEffect(() => {
        if (isFarmers) {
            const params = {};
            if (selectedMunicipality) params.municipality_id = selectedMunicipality;
            if (selectedBarangay) params.barangay_id = selectedBarangay;
            router.get(route('farmers.index'), params, { preserveState: true, replace: true });
        }
    }, [selectedMunicipality, selectedBarangay]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-green-600" />
                            <span className="text-xl font-bold text-gray-900">Hrvst</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <Link href={route('farmers.index')} className={`text-sm font-medium ${isFarmers ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Farmers</Link>
                            <Link href={route('crops.index')} className={`text-sm font-medium ${isCrops ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Crops</Link>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <Link href={route('logout')} method="post" as="button" className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                                    Sign out
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href={route('login')} className="px-6 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-md hover:text-green-700">Log in</Link>
                                    <Link href={route('register')} className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Sign up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {showLeftSidebar && (
                <div className="w-80 bg-white border-r border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
                    <div className="space-y-4">
                        <div>
                            <select value={selectedMunicipality} onChange={(e) => setSelectedMunicipality(e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                                <option value="">Municipality</option>
                                {municipalities.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select value={selectedBarangay} onChange={(e) => setSelectedBarangay(e.target.value)} disabled={!selectedMunicipality} className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100">
                                <option value="">Barangay</option>
                                {(barangaysForSelected.length ? barangaysForSelected : allBarangays).map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                )}

                <div className="flex-1">
                    {header && (
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    )}
                    {children}
                </div>

                {user?.isAdmin && isRightOpen && (
                    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 p-6 shadow-xl z-50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-semibold text-gray-900">Pending Accounts</span>
                            </div>
                            <button onClick={() => setIsRightOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="border-t border-gray-200 mb-4" />

                        {Array.isArray(page?.props?.pendingFarmers) && page.props.pendingFarmers.length > 0 ? (
                            <div className="space-y-4">
                                {page.props.pendingFarmers.map((farmer) => (
                                    <div key={farmer.id} className="bg-gray-100 p-4 rounded-lg">
                                        <div className="font-semibold">{farmer?.user?.name || 'Farmer Name'}</div>
                                        <div className="text-sm text-gray-600">
                                            {farmer?.municipality?.name}, {farmer?.barangay?.name}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => {
                                                    const detail = farmer;
                                                    try {
                                                        window.dispatchEvent(new CustomEvent('view-pending-farmer-location', { detail }));
                                                    } catch {}
                                                }}
                                                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                            >
                                                View Location
                                            </button>
                                            <button
                                                onClick={() => router.post(route('admin.farmers.approve', farmer.user.id))}
                                                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => router.delete(route('admin.farmers.reject', farmer.user.id))}
                                                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No pending farmers</p>
                        )}
                    </div>
                )}

                {user?.isAdmin && !isRightOpen && (
                    <button onClick={() => setIsRightOpen(true)} className="fixed right-4 top-24 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
}
