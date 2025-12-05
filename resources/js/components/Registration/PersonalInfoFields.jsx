import InputError from '@/Components/InputError';
import { Eye, EyeOff } from 'lucide-react';

export default function PersonalInfoFields({ data, setData, errors, showPassword, setShowPassword, showPasswordConfirmation, setShowPasswordConfirmation }) {
    return (
        <>
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    required
                    autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    required
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Create a password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <InputError message={errors.password} className="mt-2" />
            </div>

            {/* Confirm Password Field */}
            <div>
                <div className="relative">
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showPasswordConfirmation ? "text" : "password"}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm your Password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            {/* Phone Number Field */}
            <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="+63 912 345 6789"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    required
                />
                <InputError message={errors.phone_number} className="mt-2" />
            </div>
        </>
    );
}