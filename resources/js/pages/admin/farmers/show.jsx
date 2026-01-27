import AppLayout from "@/layouts/app-layout";


export default function Show({ farmer }) {

    return (
        <AppLayout title={farmer.name}>
            Show user
        </AppLayout>
    )
}