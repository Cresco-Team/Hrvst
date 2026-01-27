import { MapPinnedIcon, SproutIcon } from "lucide-react";


const publicPages = [
    {
        title: 'Main',
        pages: [
            {
                title: 'Vegetables',
                url: 'crops.index',
                icon: SproutIcon,
            }, {
                title: 'Farmers',
                url: 'farmers.index',
                icon: MapPinnedIcon,
            }
        ]
    }
]
export default publicPages