import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react";
import { MapPinned } from "lucide-react";
import { Carrot } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="h-120 bg-hero-pattern bg-center overflow-hidden border-b">
            <div className='h-full bg-background/70 flex items-center justify-center'>
                <div className="max-w-4xl mx-auto text-left">
                    <h1 className="text-4xl md:text-center md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-background bg-primary px-2 rounded-lg">Hrvst</span>
                    </h1>
                    <p className="text-base md:text-center md:text-2xl font-medium text-dark mb-8">
                        Connecting farmers and traders in Benguet Province through a centralized crop pricing platform.
                    </p>
                    <nav className="flex gap-2 md:gap-4 justify-center">
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
                    </nav>
                </div>
            </div>
        </section>
    )
}
export default HeroSection
