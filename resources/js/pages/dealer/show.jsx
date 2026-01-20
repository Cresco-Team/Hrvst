
import AuthLayout from "@/layouts/auth-layout"


const DealerPage = ({ dealer }) => {
    return (
        <AuthLayout title={'Dealer Page'}>
            <div>
                {dealer?.name}
            </div>
        </AuthLayout>
    )
}
export default DealerPage