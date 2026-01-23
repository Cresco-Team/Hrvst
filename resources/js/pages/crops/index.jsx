import AppLayout from '@/layouts/public-layout';
import { useState } from 'react';
import CategoryFilter from '@/components/sidebar/crops/category-filter';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';

import { ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Crops = ({ crops, categories, filters }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const filteredCrops = selectedCategory
        ? crops.filter(crop => crop.category_id === selectedCategory)
        : crops;
        
    return (
        <AppLayout 
            title='Crops'
            sidebarHeader='Vegetable Filters'
            sidebarContent={
                <CategoryFilter 
                    categories={categories} 
                    filters={filters}
                    selectedCategory={selectedCategory}
                    onCategoryClick={setSelectedCategory}
                />
            }
        >
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                    {filteredCrops.map(crop => (
                        <Card key={crop.id} className='p-0 max-w-sm cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-primary'>
                            <CardContent onClick={() => console.log('Go to Price Insights')} className='w-full p-0 rounded-t-xl overflow-hidden'>
                                <AspectRatio ratio={16/9} className='h-full relative'>
                                    {crop.imagePath ? (
                                        <img
                                            src={crop.imagePath.startsWith('http')
                                                ? crop.imagePath
                                                : `/storage/${crop.imagePath}`}
                                            alt={crop.name}
                                            className="w-full h-full rounded-t-xl" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary text-card"><ImageOff size={40} /></div>
                                    )}
                                    <Button
                                        size='sm'
                                        className='absolute top-2 right-2'
                                    >
                                        {crop.latestPrice.recordedAt}
                                    </Button>
                                </AspectRatio>
                                
                                <CardHeader className='py-1 px-2 gap-1'>
                                    <CardTitle>{crop.name}</CardTitle>
                                    <Separator />
                                    <CardDescription className='flex flex-col text-xs'>
                                        <div>
                                            <p>{parseFloat(crop.latestPrice.priceMin).toFixed(2)} - {parseFloat(crop.latestPrice.priceMax).toFixed(2)} PHP</p>
                                        </div>
                                        <div className=''>
                                            <p className='text-right'>{crop.cropWeeks} average weeks</p>
                                        </div>
                                        
                                    </CardDescription>
                            </CardHeader>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
            </div>
        </AppLayout>
    )
}

export default Crops;