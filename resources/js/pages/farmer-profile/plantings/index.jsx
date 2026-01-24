import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, TrendingUp, Archive } from 'lucide-react';
import PlantingCard from '@/components/profiles/farmer/cards/planting-card';
import PlantingsTable from '@/components/profiles/farmer/tables/plantings-table';
import AuthLayout from '@/layouts/auth-layout';
import { Link } from '@inertiajs/react';

const FarmerPlantings = ({ plantings, availableCrops, today, stats }) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const activePlantings = plantings.filter(p => p.status === 'active');
    const archivedPlantings = plantings.filter(p => ['harvested', 'expired'].includes(p.status));

    return (
        <AuthLayout title="My Plantings">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Plantings</h1>
                        <p className="text-muted-foreground">Track your crops from planting to harvest</p>
                    </div>
                    <Button size="lg" asChild>
                        <Link href={route('farmer.plantings.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Planting
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Plantings</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                            <p className="text-xs text-muted-foreground">Currently growing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Harvested This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.harvested_this_month}</div>
                            <p className="text-xs text-muted-foreground">Successful harvests</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Archived Records</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{archivedPlantings.length}</div>
                            <p className="text-xs text-muted-foreground">Historical data</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs: Active vs Archived */}
                <Tabs defaultValue="active" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="active">
                            Active ({activePlantings.length})
                        </TabsTrigger>
                        <TabsTrigger value="archived">
                            Archived ({archivedPlantings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                        {activePlantings.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Active Plantings</h3>
                                    <p className="text-muted-foreground mb-4">Start tracking your crops today</p>
                                    <Button onClick={() => setIsAddDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Planting
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activePlantings.map(planting => (
                                    <PlantingCard 
                                        key={planting.id} 
                                        planting={planting}
                                        availableCrops={availableCrops}
                                        today={today}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="archived">
                        {archivedPlantings.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No archived plantings yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <PlantingsTable plantings={archivedPlantings} />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AuthLayout>
    );
}
export default FarmerPlantings