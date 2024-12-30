export const Button = ({ children, variant = 'primary', ...props }) => {
    const baseStyle = "px-4 py-2 rounded font-medium transition-colors duration-200 disabled:opacity-50";
    
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        success: "bg-green-500 text-white hover:bg-green-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-purple-500 text-white hover:bg-purple-600"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Input = ({ label, ...props }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...props}
            />
        </div>
    );
};

export const Card = ({ children, title }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            {title && (
                <h2 className="text-xl font-bold mb-4">{title}</h2>
            )}
            {children}
        </div>
    );
};
