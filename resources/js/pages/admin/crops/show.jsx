
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout'

ChartJS.register(
BarElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
Colors,
) 

const ShowCrop = ({ crop, chart }) => {
    const data = {
        labels: chart.labels,
        datasets: [
          {
            label: 'Weekly Price Range',
            data: chart.ranges,
            borderRadius: 6,
          },
        ],
      }
    
      const options = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const [min, max] = ctx.raw
                return `Min: ₱${min} — Max: ₱${max}`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Price',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Week',
            },
          },
        },
      }
    

    return (
        <AppLayout title={crop.name}>
            <Bar data={data} options={options} />

            <Link href={route('admin.crops.prices.create', crop.id)}>
              <Button>
                Add new Price
              </Button>
            </Link>
            
        </AppLayout>
    )
}
export default ShowCrop