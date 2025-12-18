import InputError from '@/components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Login({ status, canResetPassword, className, ...props }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="bg-background flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
                    <Card>
                        <CardHeader className="space-y-2 sm:space-y-3">
                            <CardTitle className="text-xl sm:text-2xl">Welcome back, farmer!</CardTitle>

                            <CardDescription className="text-sm sm:text-base">
                                Get the insights you need to make decisions this season
                            </CardDescription>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-2 sm:mb-4 text-sm font-medium text-green-600 text-center">
                                    {status}
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6">
                        <form onSubmit={submit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email" className="text-sm sm:text-base">Email</FieldLabel>

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="name@gmail.com"
                                        className="h-10 sm:h-11 text-sm sm:text-base"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.email} className="mt-1 text-xs sm:text-sm" />
                                </Field>

                                <Field>
                                    <div className="flex items-center justify-between gap-2">
                                        <FieldLabel htmlFor="password" className="text-sm sm:text-base">Password</FieldLabel>

                                        {/* Forgot Password Link */}
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-xs sm:text-sm font-medium hover:underline whitespace-nowrap"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <div className='relative'>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-xs sm:text-sm" />
                                </Field>

                                <Field>
                                    <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={processing}>
                                        {processing ? 'Logging in...' : 'Login'}
                                    </Button>
                                    <FieldDescription className="text-center text-xs sm:text-sm mt-3">
                                        Not a member yet?{' '}
                                        <Link
                                            href={route('register')}
                                            className="text-gray-900 font-semibold hover:underline"
                                        >
                                            Register now
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>

                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>
        </>
    );
}