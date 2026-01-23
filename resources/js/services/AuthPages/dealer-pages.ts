import { CircleUserRoundIcon, StoreIcon } from "lucide-react"

const dealerPages = [
    {
        title: 'Main',
        pages: [
            {
                title: 'My Profile',
                url : 'dealer.profile.show',
                icon: CircleUserRoundIcon
            }, {
                title: 'The Marketplace',
                url : 'dealer.marketplace.index',
                icon: StoreIcon
            }
        ]
    }
]
export default dealerPages