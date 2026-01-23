import { ChartBarBigIcon, ChartCandlestickIcon, ChartNoAxesCombinedIcon, LayoutDashboardIcon, MapPinnedIcon, SproutIcon, SquareUserIcon } from 'lucide-react'

const adminPages = [
    {
        title: 'Main',
        pages: [
            {
                title: 'Dashboard Overview',
                url: 'admin.dashboard',
                icon: LayoutDashboardIcon,
            }
        ]
    }, {
        title: 'Vegetables',
        pages: [
            {
                title: 'Vegies Spreadsheet',
                url: 'admin.crops.index',
                icon: SproutIcon,
            }, {
                title: 'Prices Insights',
                url: 'admin.prices.index',
                icon: ChartCandlestickIcon,
            }, {
                title: 'Price Trends',
                url: 'admin.price-trends',
                icon: ChartNoAxesCombinedIcon,
            }, 
        ]
    }, {
        title: 'Farmers',
        pages: [
            {
                title: 'Farmers Spreadsheet',
                url: 'admin.farmers.index',
                icon: SquareUserIcon,
            }, {
                title: 'Geolocation',
                url: 'admin.gis.index',
                icon: MapPinnedIcon,
            }, {
                title: 'Demographics',
                url: 'admin.demo.index',
                icon: ChartBarBigIcon,
            },
        ]
    }
]
export default adminPages