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
    rightSidebarTitle = '',
    showMap = true,
    mapContent = null
}) {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    return (
        <>
            <Head title={title} />
            
            <div className="h-screen flex flex-col">
                {/* Map/Content Background */}
                <div className="fixed inset-0 top-16 z-0">
                    {showMap ? mapContent : <div className="bg-white w-full h-full" />}
                </div>

                {/* Navigation */}
                <Navigation onMobileMenuToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} />

                {/* Content */}
                <div className='relative flex flex-row overflow-hidden justify-between pointer-events-none h-full'>
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
                    <div className='grow overflow-y-auto pr-12 pointer-events-none'>
                        <div className='pointer-events-auto'>
                            {children}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    {rightSidebarContent && (
                        <RightSidebar
                            isOpen={isRightSidebarOpen}
                            onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                            badge={rightSidebarBadge}
                            title={rightSidebarTitle}
                        >
                            {rightSidebarContent}
                        </RightSidebar>
                    )}
                </div>
            </div>
        </>
    );
}