// Genreic Container

export default function LeftSidebar({ isOpen, onClose, children, title }) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    flex-col w-64 m-4 rounded-lg bg-white shadow-lg z-40 border
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    overflow-y-auto pointer-events-auto
                `}
            >
                <div className="p-6">
                    {/* Mobile Close Button */}
                    <div className="flex justify-between items-center mb-4 md:hidden">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Title */}
                    <h2 className="hidden md:block text-xl font-bold text-gray-800 mb-6">{title}</h2>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </>
    );
}