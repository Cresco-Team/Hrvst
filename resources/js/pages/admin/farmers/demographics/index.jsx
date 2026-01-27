
import { useState } from "react"
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Colors,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import AppLayout from "@/layouts/app-layout"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Colors)

const Demographics = ({ municipalities, barangays: barangaysByMunicipality }) => {
    const [currentView, setCurrentView] = useState("municipalities")
    const [selectedMunicipality, setSelectedMunicipality] = useState(null)

    const isMunicipalities = currentView === "municipalities"
    const labels = isMunicipalities
        ? municipalities.map((m) => m.name)
        : (barangaysByMunicipality?.[selectedMunicipality?.id] || []).map((b) => b.name)
    const values = isMunicipalities
        ? municipalities.map((m) => m.farmer_count)
        : (barangaysByMunicipality?.[selectedMunicipality?.id] || []).map((b) => b.farmer_count)
    const datasetLabel = isMunicipalities
        ? "Farmers per Municipality"
        : `Farmers in ${selectedMunicipality?.name}`

    const data = {
        labels,
        datasets: [
            {
                label: datasetLabel,
                data: values,
                borderRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        onClick: (event, elements) => {
            if (!elements?.length) return
            if (isMunicipalities) {
                const index = elements[0].index
                const municipality = municipalities[index]
                setSelectedMunicipality(municipality)
                setCurrentView("barangays")
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (ctx) => `Farmers: ${ctx.raw}`,
                },
            },
            legend: {
                display: true,
                position: "top",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Farmers",
                },
            },
            x: {
                title: {
                    display: true,
                    text: isMunicipalities ? "Municipality" : "Barangay",
                },
            },
        },
    }

    return (
        <AppLayout title={"Farmers Demographics"}>
            {currentView === "barangays" && (
                <div className="mb-4">
                    <button
                        onClick={() => {
                            setCurrentView("municipalities")
                            setSelectedMunicipality(null)
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                        ← Back to Municipalities
                    </button>
                </div>
            )}
            <Bar data={data} options={options} />
        </AppLayout>
    )
}
export default Demographics