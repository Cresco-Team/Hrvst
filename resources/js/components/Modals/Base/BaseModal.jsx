export default function BaseModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = 'md',
    showHeader = true,
    closeable = true,

}) {
    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4 animate-fadeIn">
            <div className={`bg-white rounded-lg w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto animate-slideIn`}>

                {/* Title */}
                {showHeader && (
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

                    {/* Close Button */}
                    {closeable && (
                        <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                    )}
                    
                </div>
                )}
                
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}