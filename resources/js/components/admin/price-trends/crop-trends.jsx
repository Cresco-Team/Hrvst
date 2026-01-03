
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    Colors,
} from "chart.js"
import "chartjs-adapter-date-fns"
import { Line } from "react-chartjs-2"

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    Colors,
)

export function CropTrends ({ trendsData }) {
    const datasets = trendsData.map((crop, index) => ({
        label: crop.crop_name,
        data: crop.data.map(point => ({
            x: point.date,
            y: point.average_price,
        })),
        stepped: true,
    }))

    const data = {
        datasets,
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "nearest",
            intersect: false
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) =>
                        `${ctx.dataset.label}: ₱${ctx.parsed.y.toFixed(2)}`
                }
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "week",
                },
                grid: {
                    display: false,
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Average Price",
                },
                ticks: {
                    callback: (value) => `₱${value}`
                }
            }
        }
    }

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    )
}