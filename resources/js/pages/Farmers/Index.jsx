import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import MapCentricLayout from '@/Layouts/MapCentricLayout';
import BaseMap from '@/Components/Map/BaseMap';
import FarmerMarker from '@/Components/Map/FarmerMarker';
import MapUpdater from '@/Components/Map/MapUpdater';
import AddressFilterPanel from '@/Components/Sidebars/AddressFilterPanel';
import FarmerProfilePanel from '@/Components/Sidebars/FarmerProfilePanel';
import AdminPendingPanel from '@/Components/Sidebars/AdminPendingPanel';
import FarmerDetailModal from '@/Components/Modals/FarmerDetailModal';

export default function Index({ farmers, municipalities, barangays: initialBarangays, filters }) {
    const { auth, pendingFarmers } = usePage().props;
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [barangays, setBarangays] = useState(initialBarangays || []);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        setBarangays(initialBarangays || []);
    }, [initialBarangays]);

    useEffect(() => {
        markersRef.current = [];
    }, [farmers]);

    const handleMunicipalityChange = (municipalityId) => {
        setSelectedMunicipality(municipalityId);
        setSelectedBarangay('');
        
        const params = {};
        if (municipalityId) params.municipality_id = municipalityId;
        
        router.get(route('farmers.index'), params, {
            preserveState: false,
            replace: true,
        });
    };

    const handleBarangayChange = (barangayId) => {
        setSelectedBarangay(barangayId);
        
        const params = {};
        if (selectedMunicipality) params.municipality_id = selectedMunicipality;
        if (barangayId) params.barangay_id = barangayId;
        
        router.get(route('farmers.index'), params, {
            preserveState: false,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSelectedMunicipality('');
        setSelectedBarangay('');
        
        router.get(route('farmers.index'), {}, {
            preserveState: false,
            replace: true,
        });
    };

    const getMapCenterAndZoom = () => {
        if (farmers.length === 0) {
            return { center: [16.4, 120.6], zoom: 10 };
        }

        const avgLat = farmers.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / farmers.length;
        const avgLng = farmers.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / farmers.length;
        
        let zoom = 10;
        if (selectedBarangay) zoom = 13;
        else if (selectedMunicipality) zoom = 11;
        
        return { center: [avgLat, avgLng], zoom };
    };

    const { center, zoom } = getMapCenterAndZoom();

    const handleViewDetails = async (farmerId) => {
        try {
            const response = await fetch(route('api.farmers.show', farmerId));
            const farmerData = await response.json();
            setSelectedFarmer(farmerData);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Error fetching farmer details:', error);
        }
    };

    const markersRef = useRef([]);

    const registerMarker = marker => {
        if (marker && !markersRef.current.includes(marker)) {
            markersRef.current.push(marker);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            markersRef.current.forEach(m => {
                m.openPopup();
            });
        }, 50);
    }, [farmers]);

    // Left sidebar content
    const leftSidebar = (
        <AddressFilterPanel
            municipalities={municipalities}
            barangays={barangays}
            selectedMunicipality={selectedMunicipality}
            selectedBarangay={selectedBarangay}
            onMunicipalityChange={handleMunicipalityChange}
            onBarangayChange={handleBarangayChange}
            onClearFilters={handleClearFilters}
        />
    );

    // Right sidebar content
    const rightSidebarContent = isAdmin ? (
        <AdminPendingPanel />
    ) : isApprovedFarmer ? (
        <FarmerProfilePanel />
    ) : null;

    // Map content
    const mapContent = (
        <BaseMap center={center} zoom={zoom}>
            <MapUpdater center={center} zoom={zoom} />
            {farmers.map(farmer => (
                <FarmerMarker
                    key={farmer.id}
                    farmer={farmer}
                    onViewDetails={handleViewDetails}
                    registerMarker={registerMarker}
                />
            ))}
        </BaseMap>
    );

    return (
        <MapCentricLayout
            title="Farmers"
            leftSidebar={leftSidebar}
            leftSidebarTitle="Address"
            rightSidebarContent={rightSidebarContent}
            rightSidebarBadge={pendingFarmers?.length || 0}
            showMap={true}
            mapContent={mapContent}
        >
            {/* Overlay message if no farmers */}
            {farmers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
                        <p className="text-gray-600 text-lg">No farmers found in this area.</p>
                    </div>
                </div>
            )}

            {/* Farmer Detail Modal */}
            <FarmerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedFarmer(null);
                }}
                farmer={selectedFarmer}
            />
        </MapCentricLayout>
    );
}