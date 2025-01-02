import Navigation from './Navigation';

const styles = {
    main: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f9fafb' // equivalent to bg-gray-50
    },
    mainContent: {
        width: '100%'
    },
    footer: {
        width: '100%',
        padding: '1rem 0',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb'
    },
    footerText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
    }
};

const Layout = ({ children }) => {
    return (
        <>
            <Navigation />
            <main style={styles.main}>
                <div style={styles.mainContent}>
                    {children}
                </div>
            </main>
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    &copy; 2024 Land Revenue Management System
                </p>
            </footer>
        </>
    );
};

export default Layout;