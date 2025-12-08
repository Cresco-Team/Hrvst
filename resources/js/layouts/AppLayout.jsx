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
            
            

            {/* Main Layout */}
            <div className="h-screen flex flex-col">

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

                {/* Navigation */}
                <Navigation onMobileMenuToggle={toggleLeftSidebar} />

                {/* Content */}
                    <div className='relative flex flex-row overflow-hidden justify-between'>
                        
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
                    <div className='flex-grow overflow-y-auto pr-12'>
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

                
            </div>
        </>
    );
}