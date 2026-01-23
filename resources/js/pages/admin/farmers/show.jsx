import AuthLayout from "@/layouts/auth-layout";


export default function Show({ farmer }) {

    return (
        <AuthLayout title={farmer.name}>
            Show user
        </AuthLayout>
    )
}