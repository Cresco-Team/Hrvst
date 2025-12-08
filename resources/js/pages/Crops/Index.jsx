import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CategoryFilterPanel from '@/Components/Sidebars/CategoryFilterPanel';
import FarmerProfilePanel from '@/Components/Sidebars/FarmerProfilePanel';
import AdminPendingPanel from '@/Components/Sidebars/AdminPendingPanel';
import CropGrid from '@/Components/Crops/CropGrid';
import CropFormModal from '@/Components/Modals/Crops/CropFormModal';

export default function Index({ 
    crops, 
    categories, 
    filters,
}) {
    const { auth, pendingFarmers } = usePage().props;

    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [searchQuery, setSearchQuery] = useState('');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // Filter crops
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

    // Left sidebar
    const leftSidebar = (
        <CategoryFilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isAdmin={isAdmin}
            onAddCrop={openCreateModal}
        />
    );

    // Right sidebar
    const rightSidebarContent = isAdmin ? (
        <AdminPendingPanel />
    ) : isApprovedFarmer ? (
        <FarmerProfilePanel />
    ) : null;

    return (
        <AppLayout
            title="Crops Page"
            leftSidebar={leftSidebar}
            leftSidebarTitle=""
            rightSidebarContent={rightSidebarContent}
            rightSidebarBadge={pendingFarmers?.length || 0}
            showMap={false}
        >
            <div className="w-full p-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <CropGrid
                        crops={displayedCrops}
                        isAdmin={isAdmin}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            <CropFormModal
                isOpen={isCreateModalOpen || isEditModalOpen}
                onClose={closeModals}
                crop={(isCreateModalOpen || isEditModalOpen) ? editingCrop : null}
                categories={categories}
            />
        </AppLayout>
    );
}