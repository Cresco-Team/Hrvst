import { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FarmerSidebar from '@/Components/FarmerSidebar';
import AdminSidebar from '@/Components/AdminSidebar';

export default function Index({ crops, categories, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedCategoryForCreate, setSelectedCategoryForCreate] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        category_id: '',
        image: null,
    });

    // Filter crops by selected category
    const displayedCrops = selectedCategory
        ? crops.filter(crop => crop.category_id == selectedCategory)
        : crops;

    // Group crops by category for display
    const cropsByCategory = categories.map(category => ({
        ...category,
        crops: displayedCrops.filter(crop => crop.category_id === category.id)
    }));

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
        router.get(route('crops.index'), 
            categoryId === selectedCategory ? {} : { category_id: categoryId },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = (categoryId) => {
        reset();
        setImagePreview(null);
        setSelectedCategoryForCreate(categoryId);
        setData('category_id', categoryId);
        setIsCreateModalOpen(true);
    };

    const openEditModal = (crop) => {
        setData({
            name: crop.name,
            price: crop.price,
            category_id: crop.category_id,
            image: null,
        });
        setImagePreview(crop.image ? `/storage/${crop.image}` : null);
        setEditingCrop(crop);
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        reset();
        setImagePreview(null);
        setEditingCrop(null);
        setSelectedCategoryForCreate(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCrop) {
            post(route('crops.update', editingCrop.id), {
                forceFormData: true,
                onSuccess: () => closeModals(),
            });
        } else {
            post(route('crops.store'), {
                forceFormData: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    const handleDelete = (crop) => {
        if (confirm(`Delete ${crop.name}? This action cannot be undone.`)) {
            router.delete(route('crops.destroy', crop.id));
        }
    };

    // Determine which sidebar to show
    const rightSidebar = isAdmin ? (
        <AdminSidebar />
    ) : isApprovedFarmer ? (
        <FarmerSidebar />
    ) : null;

    return (
        <AppLayout rightSidebar={rightSidebar}>
            <Head title="Crops" />

            <div className="flex">
                {/* Left Sidebar - Categories */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Categories</h2>
                    
                    <div className="space-y-2">
                        <button
                            onClick={() => handleCategoryClick('')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                selectedCategory === '' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">All Crops</span>
                                <span className="text-sm">{crops.length}</span>
                            </div>
                        </button>

                        {categories.map(category => (
                            <div key={category.id}>
                                <button
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                        selectedCategory == category.id 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{category.name}</span>
                                        <span className="text-sm">{category.crops_count}</span>
                                    </div>
                                </button>
                                
                                {isAdmin && selectedCategory == category.id && (
                                    <button
                                        onClick={() => openCreateModal(category.id)}
                                        className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                    >
                                        + Add Crop
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content - Crops Grid */}
                <div className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8">
                            {selectedCategory 
                                ? categories.find(c => c.id == selectedCategory)?.name 
                                : 'All Crops'}
                        </h1>

                        {displayedCrops.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No crops found in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayedCrops.map(crop => (
                                    <div key={crop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="aspect-square bg-gray-100">
                                            {crop.image ? (
                                                <img
                                                    src={`/storage/${crop.image}`}
                                                    alt={crop.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-1">{crop.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{crop.category.name}</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                ₱{parseFloat(crop.price).toFixed(2)}
                                            </p>

                                            {isAdmin && (
                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(crop)}
                                                        className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(crop)}
                                                        className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
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
            </div>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            {isEditModalOpen ? 'Edit Crop' : 'Add New Crop'}
                        </h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Crop Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="e.g., Cabbage"
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₱)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                {errors.image && (
                                    <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                                )}
                                {imagePreview && (
                                    <div className="mt-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-md border border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Crop'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}