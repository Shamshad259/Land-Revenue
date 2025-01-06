export const navigationStyles = {
    nav: {
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50
    },
    innerContainer: {
        width: '100%',
        maxWidth: '2000px',
        margin: '0 auto',
        padding: '0 2rem',
    },
    flexContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '4rem'
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    logoClickable: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    mainTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    subtitle: {
        fontSize: '0.875rem',
        marginLeft: '0.5rem',
        color: '#6b7280',
        fontWeight: '500'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem'
    },
    button: {
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s'
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
    },
    secondaryButton: {
        backgroundColor: '#e5e7eb',
        color: '#374151',
    },
    dangerButton: {
        backgroundColor: '#ef4444',
        color: 'white',
    },
    userInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    roleText: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#111827'
    },
    walletText: {
        fontSize: '0.75rem',
        color: '#6b7280',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: '200px',
        whiteSpace: 'nowrap'
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '28rem',
        width: '100%'
    },
    modalTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
    },
    modalDescription: {
        fontSize: '0.875rem',
        color: '#4b5563',
        marginBottom: '1rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem'
    }
};
