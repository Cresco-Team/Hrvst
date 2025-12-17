import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react";
import { MapPinned } from "lucide-react";
import { Carrot } from "lucide-react";

export default function Hero () {
    return (
        <div className="h-96 bg-hero-pattern bg-center border-y-2 border-dark overflow-hidden">
            <div className='h-full pt-32 pb-20 sm:px-6 lg:px-8 px-4 inset-0 bg-background/70 '>
                <div className="max-w-4xl mx-auto text-left">
                    <h1 className="text-4xl md:text-center md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-primary **bg-dark**">Hrvst</span>
                    </h1>
                    <p className="text-base md:text-center md:text-2xl font-medium text-dark mb-8">
                        Connecting farmers and traders in Benguet Province through a centralized crop pricing platform
                    </p>
                    <div className="flex gap-2 md:gap-4 justify-center">
                        <Link href={route('farmers.index')}>
                            <Button size="lg" className="w-40">
                                <MapPinned />View Farmers
                            </Button>
                        </Link>

                        <Link href={route('crops.index')}>
                            <Button size="lg" className="w-40">
                                <Carrot />View Prices
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
