// Generic Container

export default function RightSidebar({ isOpen, onToggle, children, badge }) {
    return (
        <>
            {/* Collapsed Strip - Always Visible */}
            <div
                className={`
                    absolute right-0 top-0 h-full bg-white border-l transition-all duration-300 ease-in-out z-50
                    pointer-events-auto
                    ${isOpen ? 'w-72' : 'w-16'}
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={onToggle}
                    className="absolute left-2 top-4 text-black hover:text-green-950 transition-colors"
                >
                    {!isOpen ? (
                        <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {badge > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                                    {badge}
                                </span>
                            )}
                        </>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </button>

                {/* Expanded Content */}
                {isOpen && (
                    <div className="pt-16 px-4 pb-4">
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}