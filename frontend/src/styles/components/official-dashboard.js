export const officialDashboardStyles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem'
    },
    header: {
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
        fontSize: '0.875rem',
        backgroundColor: '#f3f4f6',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontFamily: 'monospace'
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
    },
    actionButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '1rem',
        fontWeight: '500',
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
    formTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1f2937'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
    },
    input: {
        width: '100%',
        padding: '0.625rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        transition: 'all 0.2s',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
        }
    },
    select: {
        width: '100%',
        padding: '0.625rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        backgroundColor: 'white',
        fontSize: '0.875rem',
        cursor: 'pointer',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
        }
    },
    submitButton: {
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.625rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#16a34a'
        }
    },
    pendingSection: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1f2937'
    },
    pendingList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    pendingGroup: {
        backgroundColor: '#f9fafb',
        borderRadius: '0.375rem',
        padding: '1.25rem',
        border: '1px solid #e5e7eb'
    },
    subsectionTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#374151'
    },
    actionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    actionItem: {
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    actionInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    actionLabel: {
        color: '#6b7280',
        fontSize: '0.875rem',
        fontWeight: '500'
    },
    actionValue: {
        color: '#111827',
        fontSize: '0.875rem',
        fontFamily: 'monospace'
    },
    approveButton: {
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#16a34a'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    unblockButton: {
        backgroundColor: '#3b82f6',
        '&:hover': {
            backgroundColor: '#2563eb'
        }
    },
    loadingText: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '2rem'
    },
    spinner: {
        display: 'inline-block',
        width: '1.5rem',
        height: '1.5rem',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '0.5rem'
    },
    emptyState: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb'
    }
};
