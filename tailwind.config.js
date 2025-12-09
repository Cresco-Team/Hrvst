import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            /* Color Palettes */
            colors: {
                /* Main/Primary */
                'primary'           :   '#1BFF22',
                'primary-hover'     :   'color-mix(in srgb, black 50%, #1BFF22)',
                
                'secondary'         :   '#FF3912',
                'secondary-hover'   :   'color-mix(in srgb, black 50%, #FF3912)',

                'dark'              :   '#1B2226',
                'dark-hover'        :   'color-mix(in srgb, black 50%, #1B2226)',

                'safe'              :   '#263CFF',
                'safe-hover'        :   'color-mix(in srgb, black 50%, #263CFF)',

                'danger'            :   '#FF2529',
                'danger-hover'      :   'color-mix(in srgb, black 50%, #FF2529)',

                'text-highlight'    :   '#FF2529',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'fadeIn': 'fadeIn 0.2s ease-in',
                'slideIn': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },

    plugins: [forms],
};
