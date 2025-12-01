import AuthenticatedLayout from '@/Layouts/BaseLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ crops, categories, filters }) {
    const user = usePage().props.auth?.user;
    const isAdmin = !!user?.isAdmin;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [categoryId, setCategoryId] = useState(filters?.category_id || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        category_id: '',
        image: null,
    });

    const filteredCrops = useMemo(() => {
        return crops.filter(c => (
            (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
            (!categoryId || String(c.category_id) === String(categoryId))
        ));
    }, [crops, search, categoryId]);

    const openCreateModal = () => {
        reset();
        setImagePreview(null);
        setEditingCrop(null);
        setIsModalOpen(true);
    };

    const openCreateModalForCategory = (catId) => {
        reset();
        setImagePreview(null);
        setEditingCrop(null);
        setData('category_id', String(catId));
        setIsModalOpen(true);
    };

    const openEditModal = (crop) => {
        setData({ name: crop.name, price: crop.price, category_id: crop.category_id, image: null });
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
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCrop) {
            post(route('admin.crops.update', editingCrop.id), { forceFormData: true, onSuccess: () => closeModal() });
        } else {
            post(route('admin.crops.store'), { forceFormData: true, onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (crop) => {
        if (confirm(`Delete ${crop.name}? This cannot be undone.`)) {
            router.delete(route('admin.crops.destroy', crop.id));
        }
    };

    return (
        <AuthenticatedLayout showLeftSidebar={false}>
            <Head title="Crops" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-72 p-6 md:border-r border-gray-200 bg-green-50">
                                <div className="mb-4">
                                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Vegetables" className="w-full px-4 py-2 rounded-md border border-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-md border bg-white">
                                            <button onClick={() => setCategoryId(String(cat.id))} className="text-left font-medium text-gray-800">{cat.name}</button>
                                            {isAdmin && (
                                                <button onClick={() => openCreateModalForCategory(cat.id)} className="text-sm text-green-700">Add</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 p-6">
                                {filteredCrops.length === 0 ? (
                                    <p className="text-center text-gray-500">No crops found.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                        {filteredCrops.map(crop => (
                                            <div key={crop.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-white h-full">
                                                <div className="relative bg-green-100 h-40 flex items-center justify-center">
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDelete(crop)}
                                                            className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold uppercase bg-black text-white rounded-full"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                    <div className="w-10 h-10 rounded-md bg-green-500" />
                                                </div>
                                                <div className="p-4">
                                                    <div className="mb-3">
                                                        <div className="text-sm text-gray-900 font-semibold">{crop.name}</div>
                                                        <div className="text-base text-gray-900">₱ {parseFloat(crop.price).toFixed(2)}</div>
                                                    </div>
                                                    {isAdmin && (
                                                        <button onClick={() => openEditModal(crop)} className="w-full px-4 py-2 rounded-xl border-2 border-black text-gray-900">
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
                    </div>
                </div>
            </div>

            {isAdmin && isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h3>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                                {errors.name && (<p className="text-red-600 text-sm mt-1">{errors.name}</p>)}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && (<p className="text-red-600 text-sm mt-1">{errors.category_id}</p>)}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
                                <input type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                                {errors.price && (<p className="text-red-600 text-sm mt-1">{errors.price}</p>)}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500" />
                                {errors.image && (<p className="text-red-600 text-sm mt-1">{errors.image}</p>)}
                                {imagePreview && (
                                    <div className="mt-3"><img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md border border-gray-200" /></div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded-md">{processing ? 'Saving...' : 'Save Crop'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
