import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MapCentricLayout from '@/Layouts/MapCentricLayout';
import CategoryFilterPanel from '@/Components/Sidebars/CategoryFilterPanel';
import FarmerProfilePanel from '@/Components/Sidebars/FarmerProfilePanel';
import AdminPendingPanel from '@/Components/Sidebars/AdminPendingPanel';
import CropFormModal from '@/Components/Modals/CropFormModal';

export default function Index({ crops, categories, filters }) {
    const { auth, pendingFarmers } = usePage().props;
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // Filter crops by category and search
    const displayedCrops = crops.filter(crop => {
        const matchesCategory = selectedCategory ? crop.category_id == selectedCategory : true;
        const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
        router.get(
            route('crops.index'),
            categoryId === selectedCategory ? {} : { category_id: categoryId },
            { preserveState: true, replace: true }
        );
    };

    // FIXED — Create mode must NOT pass a fake crop object
    const openCreateModal = (categoryId) => {
        setEditingCrop({ category_id: categoryId });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (crop) => {
        setEditingCrop(crop);
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setEditingCrop(null);
    };

    const handleDelete = (crop) => {
        if (confirm(`Delete ${crop.name}? This action cannot be undone.`)) {
            router.delete(route('crops.destroy', crop.id));
        }
    };

    // Left sidebar content
    const leftSidebar = (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search Vegetables"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
                <CategoryFilterPanel
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                    totalCrops={crops.length}
                    isAdmin={isAdmin}
                    onAddCrop={openCreateModal}
                />
            </div>
        </div>
    );

    // Right sidebar content
    const rightSidebarContent = isAdmin ? (
        <AdminPendingPanel />
    ) : isApprovedFarmer ? (
        <FarmerProfilePanel />
    ) : null;

    return (
        <MapCentricLayout
            title="Crops"
            leftSidebar={leftSidebar}
            leftSidebarTitle="Crops"
            rightSidebarContent={rightSidebarContent}
            rightSidebarBadge={pendingFarmers?.length || 0}
            showMap={false}
        >
            {/* Main Content */}
            <div className="min-h-screen p-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {displayedCrops.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <p className="text-gray-500 text-lg">No crops found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedCrops.map(crop => (
                                <div 
                                    key={crop.id} 
                                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 relative"
                                >
                                    {/* Delete Button */}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(crop)}
                                            className="absolute top-3 right-3 z-10 px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
                                        >
                                            DELETE
                                        </button>
                                    )}

                                    {/* Image */}
                                    <div className="aspect-square bg-green-50">
                                        {crop.image ? (
                                            <img
                                                src={`/storage/${crop.image}`}
                                                alt={crop.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-16 h-16 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-base text-gray-800 mb-1">
                                            {crop.name}
                                        </h3>
                                        <p className="text-lg font-bold text-gray-900">
                                            € {parseFloat(crop.price).toFixed(2)}
                                        </p>

                                        {isAdmin && (
                                            <button
                                                onClick={() => openEditModal(crop)}
                                                className="mt-3 w-full px-4 py-2 border-2 border-black text-black text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FIXED — Single Modal Only */}
            <CropFormModal
                isOpen={isCreateModalOpen || isEditModalOpen}
                onClose={closeModals}
                crop={(isCreateModalOpen || isEditModalOpen) ? editingCrop : null}
                categories={categories}
            />
        </MapCentricLayout>
    );
}
