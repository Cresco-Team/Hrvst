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
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // Filter crops by selected category
    const displayedCrops = selectedCategory
        ? crops.filter(crop => crop.category_id == selectedCategory)
        : crops;

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
        router.get(route('crops.index'), 
            categoryId === selectedCategory ? {} : { category_id: categoryId },
            { preserveState: true, replace: true }
        );
    };

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
        <CategoryFilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            totalCrops={crops.length}
            isAdmin={isAdmin}
            onAddCrop={openCreateModal}
        />
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
            leftSidebarTitle="Categories"
            rightSidebarContent={rightSidebarContent}
            rightSidebarBadge={pendingFarmers?.length || 0}
            showMap={false}
        >
            {/* Main Content - Floating Panel with Crops Grid */}
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {selectedCategory 
                                ? categories.find(c => c.id == selectedCategory)?.name 
                                : 'All Crops'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {displayedCrops.length} {displayedCrops.length === 1 ? 'crop' : 'crops'} available
                        </p>
                    </div>

                    {/* Crops Grid */}
                    {displayedCrops.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <p className="text-gray-500 text-lg">No crops found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedCrops.map(crop => (
                                <div 
                                    key={crop.id} 
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* Crop Image */}
                                    <div className="aspect-square bg-gray-100">
                                        {crop.image ? (
                                            <img
                                                src={`/storage/${crop.image}`}
                                                alt={crop.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Crop Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                            {crop.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {crop.category.name}
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₱{parseFloat(crop.price).toFixed(2)}
                                        </p>

                                        {/* Admin Actions */}
                                        {isAdmin && (
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(crop)}
                                                    className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(crop)}
                                                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CropFormModal
                isOpen={isCreateModalOpen}
                onClose={closeModals}
                crop={editingCrop}
                categories={categories}
            />

            <CropFormModal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                crop={editingCrop}
                categories={categories}
            />
        </MapCentricLayout>
    );
}