import { useState } from "react"
import { router } from "@inertiajs/react"
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import AppLayout from "@/layouts/app-layout"

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

const Prices = ({ categories, selectedCategoryId, chartData, currentPeriod }) => {
    const [period, setPeriod] = useState(currentPeriod)
    const [categoryId, setCategoryId] = useState(selectedCategoryId)

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod)
        router.get(route('admin.prices.index'), { 
            period: newPeriod,
            category_id: categoryId 
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleCategoryChange = (e) => {
        const newCategoryId = e.target.value
        setCategoryId(newCategoryId)
        router.get(route('admin.prices.index'), { 
            period: period,
            category_id: newCategoryId 
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const colors = [
        'rgb(239, 68, 68)',     // red
        'rgb(59, 130, 246)',    // blue
        'rgb(34, 197, 94)',     // green
        'rgb(234, 179, 8)',     // yellow
        'rgb(168, 85, 247)',    // purple
        'rgb(236, 72, 153)',    // pink
        'rgb(14, 165, 233)',    // cyan
        'rgb(249, 115, 22)',    // orange
        'rgb(20, 184, 166)',    // teal
        'rgb(244, 63, 94)',     // rose
    ]

    const data = chartData ? {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '33',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: colors[index % colors.length],
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            spanGaps: true,
        })),
    } : null

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 15,
                    font: {
                        size: 13,
                        weight: 'bold',
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        return `${ctx.dataset.label}: ₱${ctx.parsed.y?.toFixed(2) || 'N/A'}`
                    },
                },
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Price (₱)',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
                ticks: {
                    callback: (value) => `₱${value}`,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.06)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: period.charAt(0).toUpperCase() + period.slice(1),
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    }

    return (
        <AppLayout title={"Vegetable Price"}>
            <div className="space-y-6">
                {/* Controls */}
                <div className="bg-white p-4 rounded-lg shadow space-y-4">
                    {/* Category Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Category
                        </label>
                        <select
                            value={categoryId || ''}
                            onChange={handleCategoryChange}
                            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Time Period
                        </label>
                        <div className="flex gap-2">
                            {['week', 'month', 'year'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePeriodChange(p)}
                                    className={`px-6 py-2 rounded-md font-semibold transition-all ${
                                        period === p
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="h-150">
                        {data && data.datasets.length > 0 ? (
                            <Line data={data} options={options} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p className="text-lg">No price data available for this category.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Summary */}
                {data && data.datasets.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.datasets.map((dataset, index) => {
                            const validPrices = dataset.data.filter(p => p !== null)
                            const avgPrice = validPrices.length > 0 
                                ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length 
                                : 0
                            const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0
                            const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0

                            return (
                                <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4" style={{ borderColor: colors[index % colors.length] }}>
                                    <h3 className="font-bold text-lg mb-3" style={{ color: colors[index % colors.length] }}>
                                        {dataset.label}
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Average:</span>
                                            <span className="font-semibold">₱{avgPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Lowest:</span>
                                            <span className="font-semibold text-green-600">₱{minPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Highest:</span>
                                            <span className="font-semibold text-red-600">₱{maxPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Data Points:</span>
                                            <span className="font-semibold">{validPrices.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
export default Prices
