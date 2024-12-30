import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <>
            <Navigation />
            <main className="flex-1 w-full bg-gray-50">
                <div className="w-full">
                    {children}
                </div>
            </main>
            <footer className="w-full py-4 bg-white border-t">
                <p className="text-center text-gray-500 text-sm">
                    &copy; 2024 Land Revenue Management System
                </p>
            </footer>
        </>
    );
};

export default Layout;
