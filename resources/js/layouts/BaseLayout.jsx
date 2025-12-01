import { Head, usePage } from '@inertiajs/react';
import Navigation from '@/components/Navigation';
import { Clock, MapPin, Check, X } from 'lucide-react';

export default function FarmersIndex() {
    const user = usePage().props.auth.user;
    
    return (
        <>
            <Head title="Farmers" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                {/* Header */}
                <Navigation auth={user} />

                {/* Main Content */}
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar - Filters */}
                    <div className="w-64 bg-white p-6 border-r border-gray-200 overflow-y-auto">
                        
                    </div>

                    {/* Farmers Grid */}
                    <div className="flex-1 overflow-y-auto p-8">
                        
                    </div>

                    {/* Clock Icon - Top Right */}
                    <div className="fixed top-20 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[1000]">
                        <Clock className="w-6 h-6 text-gray-600" />
                    </div>
                </div>
            </div>
        </>
    );
}