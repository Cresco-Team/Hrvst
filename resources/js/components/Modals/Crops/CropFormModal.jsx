import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import BaseModal from '@/Components/Modals/Base/BaseModal';
import Button from '@/Components/Buttons/Button';

export default function CropFormModal({ isOpen, onClose, crop }) {
    const isEditing = !!(crop && crop.id); // treat object-without-id as create-preload
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        low_price: '',
        high_price: '',
        harvest_weeks: '',
        category_id: '',
        image_path: null,
    });

    // Initialize when modal opens OR crop prop changes.
    useEffect(() => {
        if (!isOpen) return; // only init when modal is opening
        if (crop) {
            // crop might be a real crop (edit) or a prefill object for create ({ category_id })
            setData({
                name: crop.name || '',
                low_price: crop.low_price || '',
                high_price: crop.high_price || '',
                harvest_weeks: crop.harvest_weeks || '',
                category_id: crop.category_id || '',
                image_path: null,
            });
            setImagePreview(crop.image_path ? `/storage/${crop.image_path}` : null);
        } else {
            // fresh create with no category prefill
            reset();
            setImagePreview(null);
        }
    // include isOpen so this runs when the modal opens
    }, [crop, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image_path', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // update: use PUT semantic
            post(route('crops.update', crop.id), {
                forceFormData: true,
                data: { _method: 'PUT' },
                onSuccess: () => {
                    onClose();
                    reset();
                    setImagePreview(null);
                },
            });
        } else {
            // store: ensure category_id is present in data
            post(route('crops.store'), {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                    reset();
                    setImagePreview(null);
                },
            });
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Crop' : 'Add New Crop'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* NAME */}
                <div>
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
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Hidden category_id — must be present for store/update */}
                <input
                    type="hidden"
                    name="category_id"
                    value={data.category_id}
                    readOnly
                />

                {/* LOW PRICE */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Price (₱)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.low_price}
                        onChange={(e) => setData('low_price', e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                        placeholder="0.00"
                    />
                    {errors.low_price && <p className="text-red-600 text-sm mt-1">{errors.low_price}</p>}
                </div>

                {/* HIGH PRICE */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        High Price (₱)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.high_price}
                        onChange={(e) => setData('high_price', e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                        placeholder="0.00"
                    />
                    {errors.high_price && <p className="text-red-600 text-sm mt-1">{errors.high_price}</p>}
                </div>

                {/* HARVEST WEEKS */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harvest Weeks
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="52"
                        value={data.harvest_weeks}
                        onChange={(e) => setData('harvest_weeks', e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                        placeholder="e.g., 10"
                    />
                    {errors.harvest_weeks && <p className="text-red-600 text-sm mt-1">{errors.harvest_weeks}</p>}
                    <p className="text-xs text-gray-500 mt-1">Average weeks until harvest</p>
                </div>

                {/* IMAGE */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {errors.image_path && <p className="text-red-600 text-sm mt-1">{errors.image_path}</p>}

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

                {/* ACTIONS */}
                <div className="flex gap-2">
                    <Button variant="secondary" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" fullWidth disabled={processing}>
                        {processing ? 'Saving...' : 'Confirm'}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
}
