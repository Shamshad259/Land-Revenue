// src/styles/loginStyles.js
export const loginStyles = {
    container: {
        width: '100%',
        maxWidth: '42rem',
        margin: '0 auto'
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '2rem',
        textAlign: 'center'
    },
    errorAlert: {
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        color: '#b91c1c',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
    },
    blockedAlert: {
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        color: '#b91c1c',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
    },
    warningAlert: {
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        color: '#92400e',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
    },
    linkButton: {
        marginLeft: '0.5rem',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none'
        }
    },
    mainCard: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem'
    },
    connectButton: {
        width: '100%',
        background: 'linear-gradient(to right, #3b82f6, #2563eb)',
        color: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '1.125rem',
        fontWeight: '500',
        transition: 'all 200ms',
        '&:hover': {
            background: 'linear-gradient(to right, #2563eb, #1d4ed8)'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    walletInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    walletCard: {
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
    },
    walletLabel: {
        fontSize: '0.875rem',
        color: '#4b5563'
    },
    walletAddress: {
        fontFamily: 'monospace',
        color: '#1f2937',
        wordBreak: 'break-all'
    },
    roleContainer: {
        marginTop: '0.5rem',
        fontSize: '0.875rem'
    },
    roleLabel: {
        color: '#4b5563'
    },
    roleValue: {
        fontWeight: '500',
        color: '#111827'
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#16a34a'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#a855f7',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#9333ea'
        }
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
    },
    cancelButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#d1d5db'
        }
    },
    submitButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#2563eb'
        }
    }
};
