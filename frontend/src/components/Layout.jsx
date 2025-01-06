import Navigation from './Navigation';
import { layoutStyles } from '../styles/components/layout';

const Layout = ({ children }) => {
    return (
        <>
            <Navigation />
            <main style={layoutStyles.main}>
                <div style={layoutStyles.mainContent}>
                    {children}
                </div>
            </main>
            <footer style={layoutStyles.footer}>
                <p style={layoutStyles.footerText}>
                    &copy; 2024 Land Revenue Management System
                </p>
            </footer>
        </>
    );
};

export default Layout;