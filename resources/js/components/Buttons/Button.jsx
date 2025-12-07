// resources/js/components/Buttons/Button.jsx
import { Link } from '@inertiajs/react';

const variants = {
    // Primary Actions
    primary: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
    
    // Secondary Actions
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-300',
    
    // Destructive Actions
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    
    // Outline Variants
    outline: 'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50',
    outlineDark: 'bg-transparent border-2 border-black text-black hover:bg-gray-50',
    
    // Ghost/Minimal
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent',
    
    // Navigation specific
    nav: 'text-gray-700 hover:text-green-600 border-transparent font-medium',
    
    // Special cases
    black: 'bg-black text-white hover:bg-gray-800 border-black',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
};

export default function Button({ 
    variant = 'primary',
    size = 'md',
    href = null,
    method = null,
    disabled = false,
    fullWidth = false,
    className = '',
    children,
    ...props 
}) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 border disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
    
    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;
    const widthClass = fullWidth ? 'w-full' : '';
    
    const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`;

    // Link button
    if (href) {
        return (
            <Link
                href={href}
                method={method}
                as="button"
                className={combinedClasses}
                disabled={disabled}
                {...props}
            >
                {children}
            </Link>
        );
    }
    
    // Regular button
    return (
        <button 
            className={combinedClasses}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}