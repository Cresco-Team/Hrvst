import { Link } from "@inertiajs/react"


const PartnerSection = () => {
    return (
        <section className="h-50 bg-primary border-b flex items-center justify-start gap-5 ps-20">
            <Link
                href={'https://www.latrinidadbenguet.com/ltvtp'}
            >
                <img
                    src="assets/trading-post-logo.jpg"
                    alt="Trading Post"
                    className="aspect-square h-40 rounded-full border"
                />
            </Link>

            <header className="text-background">
                <p>In partnership with</p>
                <h2 className="text-4xl">Trading Post</h2>
            </header>
            
        </section>
    )
}
export default PartnerSection