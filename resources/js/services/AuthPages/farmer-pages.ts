import { CircleUserRoundIcon, SproutIcon } from "lucide-react"

const farmerPages = [
    {
        title: 'Main',
        pages: [
            {
                title: 'My Profile',
                url : 'farmer.show',
                icon: CircleUserRoundIcon
            }, {
                title: 'Garden',
                url : 'farmer.plantings.index',
                icon: SproutIcon
            }
        ]
    }
]
export default farmerPages