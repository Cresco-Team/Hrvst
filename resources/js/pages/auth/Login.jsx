import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/Components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "@/Components/ui/field"
import { Input } from "@/Components/ui/input"
import { Separator } from '@/Components/ui/separator';

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

            <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back, farmer!</CardTitle>

                            <CardDescription>
                                Get the insights you need to make decisions this season
                            </CardDescription>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                    {status}
                                </div>
                            )}
                        </CardHeader>

                        <CardContent>
                        <form onSubmit={submit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="name@gmail.com"
                                        required
                                        autoFocus
                                    />
                                </Field>

                                <Field>
                                    <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>

                                    {/* Forgot Password Link */}
                                    {canResetPassword && (
                                        <div className='inline-block ml-auto'>
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                    )}


                                    </div>

                                    <div className='relative'>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </Field>
                                <Field>
                                    <Button type="submit">
                                        {processing ? 'Logging in...' : 'Login'}
                                    </Button>
                                    <FieldDescription className="text-center">
                                    Not a member yet? {' '}
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