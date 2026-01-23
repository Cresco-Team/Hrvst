
import { usePage } from '@inertiajs/react';
import HomeNav from '@/components/home/home-nav';
import HeroSection from '@/components/home/sections/hero-section';
import PartnerSection from '@/components/home/sections/partner-section';
import GoalSection from '@/components/home/sections/goal-section';
import FooterSection from '@/components/home/sections/footer-section';
import FlashToaster from '@/components/flash-toaster';

export default function Index() {
    const { auth } = usePage().props

    return (
        <main className="flex flex-col min-h-screen w-full from-white to-green-300">
            <HomeNav auth={auth} />
            <FlashToaster />

            <HeroSection />

            <PartnerSection />

            <GoalSection
                labels={["Jan", "Feb", "Mar", "Apr", "May"]}
                prices={[45, 48, 47, 50, 52]}
            />

            <FooterSection />
        </main>
    );
}