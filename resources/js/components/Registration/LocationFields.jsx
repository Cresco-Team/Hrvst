import InputError from '@/Components/InputError';

export default function LocationFields({ 
    data, 
    municipalities, 
    barangays, 
    onMunicipalityChange, 
    onBarangayChange,
    errors 
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Municipality/Barangay</h3>
            
            {/* Municipality */}
            <div>
                <select
                    value={data.municipality_id}
                    onChange={(e) => onMunicipalityChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                    required
                >
                    <option value="">Select Municipality</option>
                    {municipalities.map((municipality) => (
                        <option key={municipality.id} value={municipality.id}>
                            {municipality.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.municipality_id} className="mt-2" />
            </div>

            {/* Barangay */}
            <div>
                <select
                    value={data.barangay_id}
                    onChange={(e) => onBarangayChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                    required
                    disabled={!data.municipality_id}
                >
                    <option value="">Select Barangay</option>
                    {barangays.map((barangay) => (
                        <option key={barangay.id} value={barangay.id}>
                            {barangay.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.barangay_id} className="mt-2" />
            </div>
        </div>
    );
}