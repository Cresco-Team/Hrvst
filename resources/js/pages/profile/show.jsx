import AppLayout from "@/layouts/app-layout"


const ShowProfile = ({ user, can }) => {

    return (
        <AppLayout>
            <h1>{user.name}'s profile</h1>
        </AppLayout>
    )
}
export default ShowProfile