import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterIcon, SearchIcon, XIcon } from "lucide-react"


const MarketplaceFilters = ({
    crops,
    municipalities,
    filters,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
}) => {

    return (
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
                            value={filters.crop_id || 'all'}
                            onValueChange={(value) => onFilterChange('crop_id', value)}
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
                            value={filters.municipality_id || 'all'}
                            onValueChange={(value) => onFilterChange('municipality_id', value)}
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
                            value={filters.harvest_from || ''}
                            onChange={(e) => onFilterChange('harvest_from', e.target.value)}
                        />
                    </div>

                    {/* Harvest Date To */}
                    <div className="space-y-2">
                        <Label htmlFor="harvest_to">Harvest To</Label>
                        <Input
                            id="harvest_to"
                            type="date"
                            value={filters.harvest_to || ''}
                            onChange={(e) => onFilterChange('harvest_to', e.target.value)}
                            min={filters.harvest_from}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onApplyFilters} className="cursor-pointer">
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Apply Filters
                    </Button>
                    <Button variant="outline" onClick={onClearFilters} className="cursor-pointer">
                        <XIcon className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
export default MarketplaceFilters