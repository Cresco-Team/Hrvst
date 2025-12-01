import AuthenticatedLayout from '@/Layouts/BaseLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ crops, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        price: '',
        category_id: '',
        image: null,
    });

    const openCreateModal = () => {
        reset();
        setImagePreview(null);
        setEditingCrop(null);
        setIsModalOpen(true);
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
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setImagePreview(null);
        setEditingCrop(null);
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

    const submit = (e) => {
        e.preventDefault();
    
        if (editingCrop) {
            post(route('admin.crops.update', editingCrop.id), {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.crops.store'), {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (crop) => {
        if (confirm(`Are you sure you want to delete ${crop.name}? This action cannot be undone.`)) {
            router.delete(route('admin.crops.destroy', crop.id), {
                onSuccess: () => {
                    "Deleted Successfully"
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manage Crops
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Add New Crop
                    </button>
                </div>
            }
        >
            <Head title="Manage Crops" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {crops.length === 0 ? (
                                <p className="text-center text-gray-500">No crops available. Add your first crop.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {crops.map((crop) => (
                                        <div
                                        key={crop.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden">
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
                                        <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                                        <p className="text-sm text-gray-600">{crop.category.name}</p>
                                        <p className="text-xl font-bold text-green-600 mt-2">
                                            ₱{parseFloat(crop.price).toFixed(2)}
                                        </p>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => openEditModal(crop)}
                                                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(crop)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                        </h3>
                        <form onSubmit={submit}>
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
                                    onClick={closeModal}
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
        </AuthenticatedLayout>
    );
}