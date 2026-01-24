import AuthLayout from "@/layouts/auth-layout"


const ShowProfile = ({ user, can }) => {

    return (
        <AuthLayout>
            <h1>{user.name}'s profile</h1>
        </AuthLayout>
    )
}
export default ShowProfile