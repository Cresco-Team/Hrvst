import RegistrationLayout from "@/layouts/registration-layout"
import { Link, useForm } from "@inertiajs/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Field,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
import PersonalInfoGroup from "@/components/auth/register/personal-info-group"
import AddressInfoGroup from "@/components/auth/register/address-info-group"
import { Button } from "@/components/ui/button"
import UserImageField from "@/components/auth/register/user-image-field"

const Register = ({ municipalities, barangays }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '+63',
        municipality_id: '',
        barangay_id: '',
        latitude: '',
        longitude: '',
        farm_image_path: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('register'))
    }

    return (
        <RegistrationLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter all the required fields to create your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>Unable to Register your account.</AlertTitle>
                            <AlertDescription>
                                <p>Please verify your information and try again.</p>
                                <ul className="list-disc list-inside mt-2">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form  onSubmit={submit}>
                        <FieldSet>
                            <PersonalInfoGroup
                                data={data}
                                setData={setData}
                            />
                            
                            <AddressInfoGroup
                                data={data}
                                setData={setData}
                                municipalities={municipalities}
                                barangays={barangays}
                            />

                            <FieldGroup>
                                <UserImageField
                                    data={data}
                                    setData={setData}
                                />
                            </FieldGroup>

                            <Field className="grid grid-cols-3">
                                <Button
                                    asChild
                                    type="button"
                                    variant="secondary"
                                    className="col-span-1"
                                >
                                    <Link
                                        href={route('home')}
                                    >
                                        Cancel
                                    </Link>
                                </Button>
                                <Button
                                    disabled={processing}
                                    className="col-span-2 cursor-pointer"
                                >
                                    Register
                                </Button>
                            </Field>
                        </FieldSet>
                    </form>
                </CardContent>
            </Card>
        </RegistrationLayout>
    )
}
export default Register