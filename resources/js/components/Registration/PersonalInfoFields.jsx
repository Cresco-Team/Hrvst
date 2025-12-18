
import { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';

import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError';

export default function Personal({ data, setData, errors }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    return (
        <>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="inline-flex items-center text-lg sm:text-xl md:text-2xl justify-center font-bold gap-1 sm:gap-2">
                    <User size={20} className="sm:w-6 sm:h-6" />
                    Account Registration
                </h1>
            </div>

            <Field className='gap-1'>
                <FieldLabel htmlFor='name' className="text-sm sm:text-base">Full Name</FieldLabel>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Juan Doe"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                    autoFocus
                />
                <div className='h-[16px]'>
                    {errors.name && (
                        <InputError message={errors.name} className="mt-2 text-right text-xs"/>
                    )}
                </div>
            </Field>
        
            <Field className='gap-1'>
                <FieldLabel htmlFor="email" className="text-sm sm:text-base">Email Address</FieldLabel>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="name@email.com"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                />
                <div className='h-[16px]'>
                    <InputError message={errors.email} className="mt-2 text-right text-xs"/>
                </div>
            </Field>

            <Field className='gap-1'>
                <Field className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                    <Field className='gap-1'>
                        <FieldLabel htmlFor="password" className="text-sm sm:text-base">Password</FieldLabel>
                        <div className='relative'>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="********"
                                className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch-manipulation'
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                            </button>
                        </div>
                    </Field>
                    <Field className='gap-1'>
                        <FieldLabel htmlFor='password' className="text-sm sm:text-base">Confirm Password</FieldLabel>

                        <div className='relative'>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={showConfPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="********"
                                className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfPassword(!showConfPassword)}
                                className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch-manipulation'
                                aria-label={showConfPassword ? "Hide password" : "Show password"}
                            >
                                {showConfPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                            </button>
                        </div>
                        
                    </Field>
                </Field>
                <div className='h-[16px]'>
                    <InputError message={errors.password} className="mt-2 text-right text-xs"/>
                    <InputError message={errors.password_confirmation} className="mt-2 text-right text-xs"/>
                </div>
                

                <FieldDescription  className='text-xs sm:text-sm'>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field className='gap-1 flex-1'>
                <FieldLabel htmlFor="phone_number" className="text-sm sm:text-base">Phone Number</FieldLabel>
                <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="09123456789"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                />
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="+63 912 345 6789"
                    required
                />
                <InputError message={errors.phone_number} className="mt-2 text-right text-xs"/>
            </Field>
        </>
    );
}