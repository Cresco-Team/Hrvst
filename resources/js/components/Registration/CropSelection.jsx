import InputError from '@/Components/InputError';

export default function CropSelection({ crops, selectedCrops, onCropToggle, errors }) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
                Select Crops (1-5) <span className="text-gray-500">- {selectedCrops.length} selected</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                {crops.map((crop) => (
                    <label
                        key={crop.id}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            selectedCrops.includes(crop.id)
                                ? 'bg-green-100 border-2 border-green-600'
                                : 'bg-gray-50 border border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedCrops.includes(crop.id)}
                            onChange={() => onCropToggle(crop.id)}
                            className="mr-2"
                            disabled={!selectedCrops.includes(crop.id) && selectedCrops.length >= 5}
                        />
                        <span className="text-sm">{crop.name}</span>
                    </label>
                ))}
            </div>
            <InputError message={errors.crops} className="mt-2" />
        </div>
    );
}