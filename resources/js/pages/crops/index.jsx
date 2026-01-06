import AppLayout from '@/layouts/app-layout';
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
    console.log(crops)
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

<<<<<<< HEAD:resources/js/pages/Crops/Index.jsx
export default Crops;
=======
export default Index;

/* function Index({ crops, categories, filters }) {
    const { auth, pendingFarmers } = usePage().props;
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    // State management
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // Filter crops client-side
    const displayedCrops = crops.filter(crop => {
        const matchesCategory = selectedCategory ? crop.category_id == selectedCategory : true;
        const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handlers
    const handleCategoryClick = (categoryId) => {
        const newCategory = categoryId === selectedCategory ? '' : categoryId;
        setSelectedCategory(newCategory);
        router.get(
            route('crops.index'),
            newCategory ? { category_id: newCategory } : {},
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = (categoryId) => {
        setEditingCrop({ category_id: categoryId });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (crop) => {
        setEditingCrop(crop);
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setEditingCrop(null);
    };

    const handleDelete = (crop) => {
        if (confirm(`Delete ${crop.name}? This action cannot be undone.`)) {
            router.delete(route('crops.destroy', crop.id));
        }
    };

    // Render components
    const leftSidebar = (
        <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isAdmin={isAdmin}
            onAddCrop={openCreateModal}
        />
    );

    return (
        <AppLayout
            title="Crops Page"
            leftSidebar={leftSidebar}
            leftSidebarTitle=""
            showMap={false}
        >
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                {crops.map(crop => (
                    <Card key={crop.id} className='p-0 max-w-sm cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-primary'>
                        <CardContent onClick={() => {console.log('clickable')}} className='w-full p-0 rounded-t-xl overflow-hidden'>
                            <AspectRatio ratio={16/9} className='h-full'>
                                {crop.image_path ? (
                                    <img src={`/storage/${crop.image_path}`} alt={crop.name} className="w-full h-full rounded-t-xl" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-card"><ImageOff size={40} /></div>
                                )}
                            </AspectRatio>
                            
                            <CardHeader className='py-1 px-2 gap-1'>
                                <CardTitle>{crop.name}</CardTitle>
                                <Separator />
                                <CardDescription className='flex flex-col text-xs'>
                                    <div>
                                        <p>₱: {parseFloat(crop.price_min).toFixed(2)}-{parseFloat(crop.price_max).toFixed(2)}</p>
                                    </div>
                                    <div className=''>
                                        <p className='text-right'>{crop.crop_weeks} average weeks</p>
                                    </div>
                                    
                                </CardDescription>
                        </CardHeader>
                        </CardContent>
                        
                    </Card>
                ))}
            </div>

            <CropFormModal
                isOpen={isCreateModalOpen || isEditModalOpen}
                onClose={closeModals}
                crop={(isCreateModalOpen || isEditModalOpen) ? editingCrop : null}
                categories={categories}
            />
        </AppLayout>
    );
} */
>>>>>>> ab49cde809e14f8df770c072118d8e2459d9f9a7:resources/js/pages/crops/index.jsx
