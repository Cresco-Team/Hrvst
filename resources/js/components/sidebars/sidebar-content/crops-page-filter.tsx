import { Label } from '@/components/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { router } from '@inertiajs/react'
import { SearchIcon } from 'lucide-react'

const CropPageFilter = ({ categories, filters }) => {
    const search = filters?.search ?? '';

    const applyFilters = (newFilters) => {
        router.get(
            route('crops.index'),
            {
                ...filters,
                ...newFilters,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <SidebarGroup>
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <SidebarInput
                        type="text"
                        value={search}
                        id="search"
                        placeholder="Search vegetables..."
                        onChange={(e) =>
                            applyFilters({ search: e.target.value })
                        }
                        className="pl-8"
                    />
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Categories</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() =>
                                    applyFilters({ category_id: null })
                                }
                                isActive={!filters.category_id}
                                className="cursor-pointer"
                            >
                                <span>All Vegetables</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {categories.map((category) => (
                            <SidebarMenuItem key={category.id}>
                                <SidebarMenuButton
                                    onClick={() =>
                                        applyFilters({
                                            category_id: category.id,
                                        })
                                    }
                                    isActive={
                                        filters.category_id == category.id
                                    }
                                    className="cursor-pointer"
                                >
                                    <span>{category.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    );
}
export default CropPageFilter
