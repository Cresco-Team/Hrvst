export default function CategoryFilterPanel({
    categories,
    selectedCategory,
    onCategoryClick,
    isAdmin,
    onAddCrop
}) {
    return (
        <div className="space-y-1">
            {categories.map(category => (
                <div key={category.id} className="space-y-1">
                    <button
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
                </div>
            ))}
        </div>
    );
}