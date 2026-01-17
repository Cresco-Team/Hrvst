import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"


const PersonalInfoGroup = ({data, setData}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <FieldGroup>
            <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                    id="name" 
                    name="name"
                    type="text" 
                    placeholder="Juan Doe" 
                    value={data.name}
                    onChange={(e) =>
                        setData('name', e.target.value)
                    }
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="jdoe@email.com" 
                    value={data.email}
                    onChange={(e) =>
                        setData('email', e.target.value)
                    }
                />
            </Field>

            <Field>
                <Field className="grid grid-cols-2 gap-4">
                    <Field className="relative">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div>
                            <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="absolute rounded-full right-1 top-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </Button>
                        </div>
                    </Field>
                    <Field className="relative">
                        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                        <div>
                            <Input 
                                id="confirm-password" 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={data.passwordConfirmation}
                                onChange={(e) =>
                                    setData('passwordConfirmation', e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="absolute rounded-full right-1 top-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Eye /> : <EyeOff />}
                            </Button>
                        </div>
                    </Field>
                </Field>
                <FieldDescription>
                    Must be at least 8 characters long.
                </FieldDescription>
            </Field>

            <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input 
                id="phone" 
                type="text" 
                value={data.phoneNumber}
                    onChange={(e) =>
                        setData('phoneNumber', e.target.value)
                    }
            />
            </Field>
        </FieldGroup>
    )
}
export default PersonalInfoGroup