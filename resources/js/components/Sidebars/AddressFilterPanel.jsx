// Content for Left

export default function AddressFilterPanel({
    municipalities,
    barangays,
    selectedMunicipality,
    selectedBarangay,
    onMunicipalityChange,
    onBarangayChange,
}) {
    return (
        <div className="space-y-8">
            <div>
                <select
                    value={selectedMunicipality}
                    onChange={(e) => onMunicipalityChange(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                >
                    <option value="">Municipalities</option>
                    {municipalities.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <select
                    value={selectedBarangay}
                    onChange={(e) => onBarangayChange(e.target.value)}
                    disabled={!selectedMunicipality || barangays.length === 0}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black disabled:bg-gray-100"
                >
                    <option value="">Barangays</option>
                    {barangays.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}