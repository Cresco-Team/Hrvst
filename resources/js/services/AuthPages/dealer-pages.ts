import { CircleUserRoundIcon, StoreIcon } from "lucide-react"

const dealerPages = [
    {
        title: 'Your Domain',
        pages: [
            {
                title: 'Marketplace',
                url : 'dealer.marketplace.index',
                icon: StoreIcon
            }
        ]
    }, {
        title: 'Your Profile',
        pages: [
            {
                title: 'Profile',
                url : 'dealer.profile.show',
                icon: CircleUserRoundIcon
            }
        ]
    }
]
export default dealerPages