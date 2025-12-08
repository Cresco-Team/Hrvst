export default function CategoryFilterPanel({
    categories,
    selectedCategory,
    onCategoryClick,
    searchQuery,
    onSearchChange,
    isAdmin,
    onAddCrop
}) {
    return (
        <div className="space-y-6 w-full">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search Vegetables"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
                <div className="space-y-1">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex justify-between items-center ${
                                selectedCategory == category.id 
                                    ? 'bg-black text-white font-semibold' 
                                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                            }`}
                        >
                            <span>{category.name}</span>
                            {isAdmin && selectedCategory == category.id && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddCrop(category.id);
                                    }}
                                    className="text-white hover:text-gray-200 cursor-pointer"
                                >
                                    Add
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
