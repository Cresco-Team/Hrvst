import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BaseMap from '@/Components/Map/BaseMap';
import FarmerMarker from '@/Components/Map/FarmerMarker';
import MapUpdater from '@/Components/Map/MapUpdater';
import AddressFilterPanel from '@/Components/Sidebars/AddressFilterPanel';
import FarmerProfilePanel from '@/Components/Sidebars/FarmerProfilePanel';
import AdminPendingPanel from '@/Components/Sidebars/AdminPendingPanel';
import FarmerDetailModal from '@/Components/Modals/FarmerDetailModal';

export default function Index({ 
    farmers, 
    municipalities, 
    barangays: initialBarangays, 
    filters 
}) {
    const { auth, pendingFarmers } = usePage().props;
    
    // Checks if the user is Admin or Approved Farmer
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    // Left Sidebar Contents
    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');

    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const barangays = initialBarangays;

    useEffect(() => {
        markersRef.current = [];
    }, [farmers]);

    // --------------------------------------------------------
    // Address Filter Handler
    // --------------------------------------------------------
    const updateFilters = (newFilters) => {
        const params = {
            municipality_id: (newFilters.municipality ?? selectedMunicipality) || '',
            barangay_id: (newFilters.barangay ?? selectedBarangay) || '',
        };

        Object.keys(params).forEach(k => !params[k] && delete params[k]);

        router.get(route('farmers.index'), params, {
            preserveState: false,
            replace: true,
        })
    }

    /* Municipality */
    const handleMunicipalityChange = (id) => {
        setSelectedMunicipality(id);
        setSelectedBarangay('');
        updateFilters({ municipality: id, barangay:'' });
    };

    /* Barangay */
    const handleBarangayChange = (id) => {
        setSelectedBarangay(id);
        updateFilters({ barangay: id });
    };

    // --------------------------------------------------------
    // Leaflet Map
    // --------------------------------------------------------

    /* Searches for the Average Center Coordinate of Farmers */
    const getMapCenterAndZoom = () => {
        if (farmers.length === 0) {
            return { center: [16.4, 120.6], zoom: 11 };
        }

        const avgLat = farmers.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / farmers.length;
        const avgLng = farmers.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / farmers.length;
        
        let zoom = 11;
        
        return { center: [avgLat, avgLng], zoom };
    };
    /* Object Destructuring the Map Center and Zoom */
    const { center, zoom } = getMapCenterAndZoom();

    /* Fetches Farmer Data */
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
        requestAnimationFrame(() => {
            markersRef.current.forEach(m => {
                m.openPopup();
            });
        });
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
        />
    );

    // Right sidebar content
    const rightSidebarContent = isAdmin
        ? <AdminPendingPanel />
        : isApprovedFarmer
        ? <FarmerProfilePanel />
        : null;
        
    // --------------------------------------------------------
    // Map Content
    // --------------------------------------------------------
    const mapContent = (
        /* Sets the Foundation for Displaying Map */
        <BaseMap center={center} zoom={zoom}>
            {/* Reactive Map for External user Actions(Selecting Address) */}
            <MapUpdater center={center} zoom={zoom} />
            {/* Farmer Markers connects to the BaseMap */}
            {farmers.map(farmer => (
                <FarmerMarker
                    key={farmer.id}
                    farmer={farmer}
                    onViewDetails={handleViewDetails}       // Fetches Farmer Data then Opens Modal
                    registerMarker={registerMarker}         // Registers marker for Farmers
                />
            ))}
        </BaseMap>
    );

    return (
        <AppLayout
            title="Farmers"                                 // Page Title
            leftSidebar={leftSidebar}                       // Sidebar Content
            leftSidebarTitle="Address"                      // Left Sidebar Header
            rightSidebarContent={rightSidebarContent}       // Sidebar exclusive for Admin & Approved Farmer
            rightSidebarBadge={pendingFarmers?.length || 0} // Shows Number Badge for Pending Farmers
            showMap={true}                                  // Adds the Map Background
            mapContent={mapContent}                         // Gives Map Content
        >

            {/* Farmer Detail Modal */}
            <FarmerDetailModal
                isOpen={isDetailModalOpen}                  // If the Function Ran, Display the Modal
                onClose={() => {
                    setIsDetailModalOpen(false);            // Set False to Exit the Modal
                    setSelectedFarmer(null);                // If there's Farmer, Display their Info
                }}
                farmer={selectedFarmer}
            />
        </AppLayout>
    );
}