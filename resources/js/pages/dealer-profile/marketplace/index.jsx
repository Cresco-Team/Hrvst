import MarketplaceFilters from "@/components/features/dealer/marketplace/marketplace-filters"
import MarketplaceStats from "@/components/features/dealer/marketplace/marketplace-stats"
import PlantingCard from "@/components/features/dealer/marketplace/planting-card"
import { Card, CardContent } from "@/components/ui/card"
import AuthLayout from "@/layouts/auth-layout"
import { router } from "@inertiajs/react"
import { SearchIcon } from "lucide-react"
import { useState } from "react"


const Marketplace = ({ crops, municipalities, plantings, filters, stats }) => {
    const [localFilters, setLocalFilters] = useState(filters)

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }))
    }

    const applyFilters = () => {
        const params = Object.fromEntries(
            Object.entries(localFilters).filter(([_, v]) => v !== '' && v !== 'all')
        )
        
        router.get(route('dealer.marketplace.index'), params, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const clearFilters = () => {
        setLocalFilters({
            crop_id: '',
            municipality_id: '',
            harvest_from: '',
            harvest_to: '',
        })
        
        router.get(route('dealer.marketplace.index'), {}, {
            preserveState: false,
        })
    }

    const handleContactFarmer = (farmerId, plantingId) => {
        router.get(route('dealer.messages.show', farmerId), {
            planting_id: plantingId
        })
    }

    return (
        <AuthLayout title="Marketplace">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Search Farmers by Crop</h1>
                    <p className="text-muted-foreground">Find farmers growing specific crops for procurement</p>
                </div>

                {/* Stats */}
                <MarketplaceStats stats={stats} />

                {/* Filters */}
                <MarketplaceFilters
                    crops={crops}
                    municipalities={municipalities}
                    filters={localFilters}
                    onFilterChange={handleFilterChange}
                    onApplyFilters={applyFilters}
                    onClearFilters={clearFilters}
                />

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
                                <PlantingCard
                                    key={planting.id}
                                    planting={planting}
                                    onContactFarmer={handleContactFarmer}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthLayout>
    )
}
export default Marketplace