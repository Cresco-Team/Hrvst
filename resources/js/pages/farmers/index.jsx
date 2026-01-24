import { 
    useState,
    useEffect,
    useRef,
 } from 'react';
import PublicLayout from '@/layouts/public-layout';
import FarmersPageFilter from '@/components/sidebars/sidebar-content/farmers-page-filter';
import BaseMap from '@/components/shared/map/BaseMap';
import MapResizer from '@/components/shared/map/map-resizer'
import MapUpdater from '@/components/shared/map/MapUpdater';
import FarmerMarker from '@/components/shared/map/FarmerMarker';
/* import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import BaseMap from '@/components/Map/BaseMap';


import FarmerDetailModal from '@/components/Modals/Farmers/FarmerDetailModal'; */

const Index = ({ farmers, municipalities, filters }) => {
    // State management
    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const markersRef = useRef([]);

    // Markers
    useEffect(() => {
        markersRef.current = [];
    }, [farmers])

    // Popups
    useEffect(() => {
        requestAnimationFrame(() => {
            markersRef.current.forEach(m => m.openPopup())
        })
    }, [farmers])

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

    // Map calculations
    const getMapCenterAndZoom = () => {
        if (farmers.length === 0) return { center: [16.4, 120.6], zoom: 11 };
        const avgLat = farmers.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / farmers.length;
        const avgLng = farmers.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / farmers.length;
        return { center: [avgLat, avgLng], zoom: 11 }
    }
    const { center, zoom } = getMapCenterAndZoom()

    return (
        <PublicLayout
            title='Farmers'
            sidebarHeader='Farmer Filters'
            sidebarContent={
                <FarmersPageFilter
                    municipalities={municipalities}
                    filters={filters}
                />
            }
        >
            <div className='absolute inset-0 z-0'>
                <BaseMap
                    center={center}
                    zoom={zoom}
                >
                    <MapResizer />
                    <MapUpdater
                        center={center}
                        zoom={zoom}
                    />

                    {farmers.map(farmer => (
                        <FarmerMarker
                            key={farmer.id}
                            farmer={farmer}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </BaseMap>
            </div>
        </PublicLayout>
    )
}

export default Index;

/* export default function Index({ farmers, municipalities, barangays: initialBarangays, filters }) {
    const { auth, pendingFarmers } = usePage().props;
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    // State management
    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [barangays, setBarangays] = useState(initialBarangays);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const markersRef = useRef([]);

    // Initialize markers
    useEffect(() => {
        markersRef.current = [];
    }, [farmers]);

    // Auto-open popups
    useEffect(() => {
        requestAnimationFrame(() => {
            markersRef.current.forEach(m => m.openPopup());
        });
    }, [farmers]);

    // Handlers
    const updateFilters = (newFilters) => {
        const params = {
            municipality_id: (newFilters.municipality ?? selectedMunicipality) || '',
            barangay_id: (newFilters.barangay ?? selectedBarangay) || '',
        };
        Object.keys(params).forEach(k => !params[k] && delete params[k]);
        router.get(route('farmers.index'), params, { preserveState: false, replace: true });
    };

    const handleMunicipalityChange = (id) => {
        setSelectedMunicipality(id);
        setSelectedBarangay('');
        updateFilters({ municipality: id, barangay: '' });
    };

    const handleBarangayChange = (id) => {
        setSelectedBarangay(id);
        updateFilters({ barangay: id });
    };

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

    const registerMarker = marker => {
        if (marker && !markersRef.current.includes(marker)) {
            markersRef.current.push(marker);
        }
    };

    // Map calculations
    const getMapCenterAndZoom = () => {
        if (farmers.length === 0) return { center: [16.4, 120.6], zoom: 11 };
        const avgLat = farmers.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / farmers.length;
        const avgLng = farmers.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / farmers.length;
        return { center: [avgLat, avgLng], zoom: 11 };
    };
    const { center, zoom } = getMapCenterAndZoom();

    // Render components
    const leftSidebar = (
        <FarmersPageFilter
            municipalities={municipalities}
            barangays={barangays}
            selectedMunicipality={selectedMunicipality}
            selectedBarangay={selectedBarangay}
            onMunicipalityChange={handleMunicipalityChange}
            onBarangayChange={handleBarangayChange}
        />
    );

    const rightSidebarContent = isAdmin 
        ? <AdminPendingPanel />
        : isApprovedFarmer 
        ? <FarmerProfilePanel />
        : null;

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
        <PublicLayout
            title="Farmers"
            leftSidebar={leftSidebar}
            leftSidebarTitle="Address"
            rightSidebarContent={rightSidebarContent}
            rightSidebarBadge={pendingFarmers?.length || 0}
            showMap={true}
            mapContent={mapContent}
        >
            <FarmerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedFarmer(null);
                }}
                farmer={selectedFarmer}
            />
        </PublicLayout>
    );
} */
