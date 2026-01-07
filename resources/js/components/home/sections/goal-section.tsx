import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Line } from "react-chartjs-2"
  
  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
  )

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bolt, ChartArea, MapPin } from "lucide-react";


const GoalSection = ({ labels, prices }) => {
    const data = {
        labels,
        datasets: [
          {
            data: prices,
            borderColor: '#FF6384',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
        ],
      };
    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      };

    return (
        <section className="grid grid-cols-3 gap-5 px-20 py-15">
            <Card>
                <CardContent className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center text-primary">
                    <ChartArea size={64} />
                </CardContent>
                <CardHeader>
                    <CardTitle>
                        See Daily Price Movements
                    </CardTitle>
                    <CardDescription>
                        The platform provides comprehensive access to up-to-date vegetable valuations and historical price fluctuations via detailed graphical representations.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
            <CardContent className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center text-primary">
                    <MapPin size={64} />
                </CardContent>
                <CardHeader>
                    <CardTitle>
                        Farmers Avoid Underpricing
                    </CardTitle>
                    <CardDescription>
                        Our integrated geographic information system (GIS) allows users to geolocate registered farmers across the various municipalities of Benguet.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
            <CardContent className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center text-primary">
                    <Bolt size={64} />
                </CardContent>
                <CardHeader>
                    <CardTitle>
                        Easy Management
                    </CardTitle>
                    <CardDescription>
                        Our platform empowers managers to standardize fair pricing centrally, protecting both farmers and buyers from market volatility.
                    </CardDescription>
                </CardHeader>
            </Card>
        </section>
    )
}
export default GoalSection