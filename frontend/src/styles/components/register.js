export const registerStyles = {
    container: {
        padding: '1.5rem',
        maxWidth: '28rem',
        margin: '0 auto'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
    },
    errorAlert: {
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        color: '#b91c1c',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
    },
    statusAlert: (type) => ({
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        border: '1px solid',
        ...{
            'error': {
                backgroundColor: '#fee2e2',
                borderColor: '#ef4444',
                color: '#b91c1c'
            },
            'success': {
                backgroundColor: '#dcfce7',
                borderColor: '#22c55e',
                color: '#15803d'
            },
            'info': {
                backgroundColor: '#dbeafe',
                borderColor: '#3b82f6',
                color: '#1e40af'
            }
        }[type]
    }),
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    walletInfoCard: {
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.375rem',
        wordBreak: 'break-all'
    },
    walletLabel: {
        fontSize: '0.875rem',
        color: '#4b5563',
        marginBottom: '0.25rem'
    },
    walletAddress: {
        fontFamily: 'monospace',
        fontSize: '0.875rem'
    },
    inputContainer: {
        marginBottom: '1rem'
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        outline: 'none',
        '&:focus': {
            borderColor: '#a855f7',
            boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.2)'
        }
    },
    helperText: {
        marginTop: '0.25rem',
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    connectButton: {
        width: '100%',
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        border: 'none',
        '&:hover': {
            backgroundColor: '#2563eb'
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
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9333ea'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    loginSection: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    loginLink: {
        color: '#a855f7',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        '&:hover': {
            color: '#9333ea'
        }
    }
};
