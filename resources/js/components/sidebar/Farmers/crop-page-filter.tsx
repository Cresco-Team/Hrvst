import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar'
import { router } from '@inertiajs/react'
import { ChevronRightIcon } from 'lucide-react'

const CropPageFilter = ({ municipalities, filters }) => {
    const municipality_id = filters?.municipality_id ?? null

    return (
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={() =>
                            router.get(route('farmers.index'), {
                                municipality_id: null,
                            })
                        }
                        isActive={municipality_id === null}
                        className="cursor-pointer"
                    >
                        <SidebarGroupLabel>
                            Municipalities
                        </SidebarGroupLabel>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {municipalities.map((municipality) => (
                    <Collapsible
                        key={municipality.id}
                        asChild
                        defaultOpen={
                            filters.municipality_id == municipality.id
                        }
                        className="cursor-pointer"
                    >
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() =>
                                    router.get(route('farmers.index'), {
                                        municipality_id: municipality.id,
                                    })
                                }
                                isActive={
                                    filters.municipality_id ==
                                    municipality.id
                                }
                            >
                                {municipality.name}
                            </SidebarMenuButton>
                            <>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                                        <ChevronRightIcon />
                                        <span className="sr-only">
                                            Toggle
                                        </span>
                                    </SidebarMenuAction>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {municipality.barangays?.map(
                                            (barangay) => (
                                                <SidebarMenuSubItem
                                                    key={barangay.id}
                                                >
                                                    <SidebarMenuSubButton
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    'farmers.index',
                                                                ),
                                                                {
                                                                    municipality_id:
                                                                        municipality.id,
                                                                    barangay_id:
                                                                        barangay.id,
                                                                },
                                                            )
                                                        }
                                                        isActive={
                                                            filters.barangay_id ==
                                                            barangay.id
                                                        }
                                                    >
                                                        {barangay.name}
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ),
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
export default CropPageFilter