
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { ChevronsUp, ChevronsDown } from "lucide-react"
  
ChartJS.register(ArcElement, Tooltip)

export default function MarketMovers({ crop }) {
    const value = Math.min(Math.abs(crop.percent_change), 100)
    const isUp = crop.percent_change > 0
    const color = isUp ? "text-primary" : "text-destructive"
    const getVar = (name) => {
        if (typeof window === 'undefined') return '';
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    const data = {
        datasets: [
            {
                data: [value, 100 - value],
                backgroundColor: [
                    isUp ? getVar('--primary') : getVar('--destructive'),
                    getVar('--muted'),
                ],
                borderWidth: 0,
                cutout: "70%",
            }
        ]
    }
    
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: () =>
                    `${isUp ? "+" : "-"}${value.toFixed(2)}%`,
                }
            }
        }
    }

    return(
        <div className="relative w-20">
            <Doughnut data={data} options={options} />
            <div className={`absolute inset-0 flex items-center justify-center text-xs ${color}`}>
                <p>
                    {Math.round(crop.percent_change)}%
                </p>
                
            </div>
        </div>
    )

}