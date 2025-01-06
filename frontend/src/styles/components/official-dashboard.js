export const officialDashboardStyles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem'
    },
    header: {
        marginBottom: '2rem'
    },
    headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
    },
    headerTitle: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    headerSubtitle: {
        color: '#6b7280',
        marginTop: '0.5rem'
    },
    userInfo: {
        color: '#6b7280',
        fontSize: '0.875rem'
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
    },
    actionButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#2563eb'
        }
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
    },
    // ... all remaining styles from OfficialDashboard component
};
