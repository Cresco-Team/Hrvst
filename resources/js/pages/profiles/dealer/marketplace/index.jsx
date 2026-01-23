import AuthLayout from "@/layouts/auth-layout"
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, FilterIcon, PackageIcon, SearchIcon, TrendingUpIcon, UsersIcon } from "lucide-react"
import FarmerPlantingCard from "@/components/profiles/dealer/cards/farmer-planting-card"
import FarmerDetailModal from "@/components/Modals/Farmers/FarmerDetailModal"

const Marketplace = ({ crops, municipalities, plantings, filters, stats }) => {
    const [localFilters, setLocalFilters] = useState({
        crop_id: filters.crop_id || 'all',
        municipality_id: filters.municipality_id || 'all',
        harvest_from: filters.harvest_from || '',
        harvest_to: filters.harvest_to || '',
    });

    const [selectedFarmerId, setSelectedFarmerId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }))
    };

    const applyFilters = () => {
        const params = Object.fromEntries(
            Object.entries(localFilters).filter(([_, v]) => v !== '')
        );
        
        router.get(route('dealer.search.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            crop_id: '',
            municipality_id: '',
            harvest_from: '',
            harvest_to: '',
        });
        router.get(route('dealer.search.index'))
    };

    const viewFarmerDetails = (farmerId) => {
        setSelectedFarmerId(farmerId)
        setIsModalOpen(true)
    };

    return (
        <AuthLayout title={'Dealer Page'}>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Search Farmers by Crop</h1>
                    <p className="text-muted-foreground">Find farmers growing specific crops for procurement</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_farmers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Plantings</CardTitle>
                            <PackageIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_plantings}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Yield</CardTitle>
                            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_yield_kg ? `${stats.total_yield_kg.toFixed(0)} kg` : '—'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Days to Harvest</CardTitle>
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.avg_days_to_harvest ? Math.round(stats.avg_days_to_harvest) : '—'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FilterIcon className="h-5 w-5" />
                            Search Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Crop Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="crop_id">Crop</Label>
                                <Select
                                    value={localFilters.crop_id}
                                    onValueChange={(value) => handleFilterChange('crop_id', value)}
                                >
                                    <SelectTrigger id="crop_id">
                                        <SelectValue placeholder="All crops" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All crops</SelectItem>
                                        {crops.map((crop) => (
                                            <SelectItem key={crop.id} value={crop.id.toString()}>
                                                {crop.name} ({crop.category})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Municipality Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="municipality_id">Municipality</Label>
                                <Select
                                    value={localFilters.municipality_id}
                                    onValueChange={(value) => handleFilterChange('municipality_id', value)}
                                >
                                    <SelectTrigger id="municipality_id">
                                        <SelectValue placeholder="All locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All locations</SelectItem>
                                        {municipalities.map((muni) => (
                                            <SelectItem key={muni.id} value={muni.id.toString()}>
                                                {muni.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Harvest Date From */}
                            <div className="space-y-2">
                                <Label htmlFor="harvest_from">Harvest From</Label>
                                <Input
                                    id="harvest_from"
                                    type="date"
                                    value={localFilters.harvest_from}
                                    onChange={(e) => handleFilterChange('harvest_from', e.target.value)}
                                />
                            </div>

                            {/* Harvest Date To */}
                            <div className="space-y-2">
                                <Label htmlFor="harvest_to">Harvest To</Label>
                                <Input
                                    id="harvest_to"
                                    type="date"
                                    value={localFilters.harvest_to}
                                    onChange={(e) => handleFilterChange('harvest_to', e.target.value)}
                                    min={localFilters.harvest_from}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={applyFilters}>
                                <SearchIcon className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Search Results ({plantings.length})
                    </h2>
                    
                    {plantings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-semibold mb-2">No Results Found</p>
                                <p className="text-muted-foreground">
                                    Try adjusting your search filters
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plantings.map((planting) => (
                                <FarmerPlantingCard
                                    key={planting.id}
                                    planting={planting}
                                    onViewDetails={() => viewFarmerDetails(planting.farmer.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Farmer Detail Modal */}
                <FarmerDetailModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    farmerId={selectedFarmerId}
                />
            </div>
        </AuthLayout>
    )
}
export default Marketplace