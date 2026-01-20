const adminPages = [
    {
        title: "Main",
        pages: [
            {
                title: 'Dashboard Overview',
                url: 'admin.dashboard',
                icon: 'LayoutDashboard',
                isActive: true,
            }
        ]
    }, {
        title: "Vegetables",
        pages: [
            {
                title: 'Vegies Spreadsheet',
                url: 'admin.crops.index',
                icon: 'Sprout',
            }, {
                title: 'Prices Insights',
                url: 'admin.prices.index',
                icon: 'ChartCandlestick',
            }, {
                title: 'Price Trends',
                url: 'admin.price-trends',
                icon: 'ChartNoAxesCombined',
            }, 
        ]
    }, {
        title: "Farmers",
        pages: [
            {
                title: 'Farmers Spreadsheet',
                url: 'admin.farmers.index',
                icon: 'SquareUser',
            }, {
                title: 'Geolocation',
                url: 'admin.gis.index',
                icon: 'MapPinned',
            }, {
                title: 'Demographics',
                url: 'admin.demo.index',
                icon: 'ChartBarBig',
            },
        ]
    }
]
export default adminPages