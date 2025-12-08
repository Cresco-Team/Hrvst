import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navigation from '@/Components/Navigation/Navigation';
import LeftSidebar from '@/Components/Sidebars/LeftSidebar';
import RightSidebar from '@/Components/Sidebars/RightSidebar';

export default function AppLayout({ 
    children, 
    title,
    leftSidebar = null,
    leftSidebarTitle = '',
    rightSidebarContent = null,
    rightSidebarBadge = 0,
    showMap = true,
    mapContent = null
}) {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    const toggleLeftSidebar = () => {
        setIsLeftSidebarOpen(!isLeftSidebarOpen);
    };

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    return (
        <>
            <Head title={title} />
            
            {/* Navigation */}
            <Navigation onMobileMenuToggle={toggleLeftSidebar} />

            {/* Main Layout */}
            <div className="p-0 min-h-screen">
                {/* Map Background (if enabled) */}
                {showMap && (
                    <div className="fixed inset-0 top-16 z-0">
                        {mapContent}
                    </div>
                )}

                {/* Content Background (if no map) */}
                {!showMap && (
                    <div className="fixed inset-0 top-16 z-0 bg-white" />
                )}

                {/* Left Sidebar */}
                {leftSidebar && (
                    <LeftSidebar
                        isOpen={isLeftSidebarOpen}
                        onClose={() => setIsLeftSidebarOpen(false)}
                        title={leftSidebarTitle}
                    >
                        {leftSidebar}
                    </LeftSidebar>
                )}

                {/* Main Content Area */}
                <div className={`pt-12 relative ${leftSidebar ? 'md:ml-64' : ''}`}>
                    {children}
                </div>

                {/* Right Sidebar */}
                {rightSidebarContent && (
                    <RightSidebar
                        isOpen={isRightSidebarOpen}
                        onToggle={toggleRightSidebar}
                        badge={rightSidebarBadge}
                    >
                        {rightSidebarContent}
                    </RightSidebar>
                )}
            </div>
        </>
    );
}