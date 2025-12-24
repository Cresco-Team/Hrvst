import { useState, useMemo } from 'react';
import { useMedia } from 'react-use';

import { Field, FieldLabel } from '@/components/ui/field';
import { Item, ItemGroup, ItemActions, ItemContent, ItemTitle, ItemMedia, ItemDescription } from '@/components/ui/item';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ScrollArea } from '../ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import { Button } from '@/components/ui/button';
import { CirclePlus, Sprout, Trash } from 'lucide-react';

export default function CropSelection({ data, setData, errors, categories, crops }) {
    const isMobile = useMedia('(max-width: 767px)')
    const [selection, setSelection] = useState(data.crops || []);

    const selectedCrops = crops.filter(crop => data.crops.includes(crop.id));

    const handleSelection = (cropID) => {
        setSelection(prev => {
            if (prev.includes(cropID)) {
                return prev.filter(id => id !== cropID);
            }
            if (prev.length >= 3) return prev;
            return [...prev, cropID];
        });
    }

    const handleConfirm = () => {
        setData('crops', selection);
    }

    const handleRemove = (cropID) => {
        const updated = data.crops.filter(id => id !== cropID);
        setData('crops', updated);
        setSelection(updated);
    }

    const cropsByCategory = useMemo(() => {
        const map = {}
        crops?.forEach(crop => {
            const catID = crop.category_id
            if(!map[catID]) map[catID] = []
            map[catID].push(crop)
        })
        return map
    }, [crops])

    if (isMobile) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Plants</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <>
            <div className="flex-none items-center gap-2 text-center">
                <h1 className="inline-flex items-center justify-center md:text-2xl text-lg font-bold gap-1"><Sprout/>Share your Harvest~</h1>
            </div>

            <Field className='flex-1 flex'>
                <FieldLabel htmlFor='crops' className='flex-0 h-full'>
                    Vegetables({data.selectedCrops?.length || 0}/3)
                </FieldLabel>

                <div className='flex-1'>
                    {selectedCrops.length > 0 && (
                        <ItemGroup className='grow h-[278px] flex flex-col gap-2 mb-3'>
                            {selectedCrops.map(crop => (
                                <Item key={crop.id} variant='outline'>
                                    <ItemMedia>
                                        <Avatar className='rounded-sm'>
                                            <AvatarImage src={`/storage/${crop.image_path}`}/>
                                            <AvatarFallback>{crop.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </ItemMedia>
                                    <ItemContent className='gap-1'>
                                        <ItemTitle>{crop.name}</ItemTitle>
                                        <ItemDescription>{crop.category.name}</ItemDescription>
                                    </ItemContent>
                                    <ItemActions>
                                        <Button onClick={() => handleRemove(crop.id)} variant='ghost' size='icon' className='rounded-full'>
                                            <Trash/>
                                        </Button>
                                    </ItemActions>
                                </Item>
                            ))}
                        </ItemGroup>
                    )}
                </div>
                

                <Drawer className='flex-none'>
                    <DrawerTrigger asChild>
                        <Button variant='secondary'><CirclePlus/>Add Plant</Button>
                    </DrawerTrigger>

                    <DrawerContent>
                        <div className=' mx-auto w-full max-w-md gap-7'>
                            <DrawerHeader>
                                <DrawerTitle>Add Plants</DrawerTitle>
                            </DrawerHeader>
                        
                        <ScrollArea className='mx-auto w-full h-[55vh] px-1'>
                            <div className='mx-auto w-full max-w-sm'>
                                {categories?.map((category) => (
                                    <div key={category.id} value={String(category.id)} className='w-full p-3'>
                                        <div className='flex items-center gap-4'>
                                            <h3 className='shrink-0'>{category.name}</h3>
                                        </div>
                                    
                                        <Carousel
                                            opts={{
                                                align: "start",
                                                slidesToScroll: 2,
                                            }}
                                            className='w-full max-w-sm'
                                        >
                                            <CarouselContent>
                                                {cropsByCategory[category.id]?.map(crop => {
                                                    const selected = selection.includes(crop.id)

                                                    return (
                                                        <CarouselItem key={crop.id} className={'basis-1/3 w-full mx-1'}>
                                                            <div
                                                                onClick={() => handleSelection(crop.id)}
                                                                className={`bg-card border rounded-md cursor-pointer space-y-1 my-1 text-center transition
                                                                    ${selected ? "ring-2 ring-primary bg-muted" : " "}
                                                                `}
                                                            >
                                                                <AspectRatio ratio={16/9} className='overflow-hidden rounded-t-md'>
                                                                    <img
                                                                        src={`/storage/${crop.image_path}`}
                                                                        alt={crop.name}
                                                                        className='object-cover h-full w-full'
                                                                    />
                                                                </AspectRatio>

                                                                <p className='text-xs font-medium truncate'>
                                                                    {crop.name}
                                                                </p>
                                                            </div>
                                                        </CarouselItem>
                                                    )
                                                })}
                                            </CarouselContent>
                                            {!isMobile && (
                                                <>
                                                    <CarouselPrevious/>
                                                    <CarouselNext/>
                                                </>
                                            )}
                                        </Carousel>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button onClick={handleConfirm}><Sprout/>Add</Button>
                            </DrawerClose>
                        </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </Field>
        </>
    );
}
