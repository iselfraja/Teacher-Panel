import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountSetup = () => {
    const [accountName, setAccountName] = useState('');
    const [error, setError] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const navigate = useNavigate();

    // Main container
    const pageContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundImage: 'url(https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '15px',
        margin: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
    };

    // Overlay
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(2px)',
        zIndex: 1
    };

    // Compact form container
    const formContainerStyle = {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: '30px 25px',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden'
    };

    // Logo styles
    const logoContainerStyle = {
        textAlign: 'center',
        marginBottom: '25px'
    };

    const logoImageStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #4a6ee0',
        boxShadow: '0 3px 10px rgba(74, 110, 224, 0.25)',
        marginBottom: '12px'
    };

    const schoolNameStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '4px',
        lineHeight: '1.2'
    };

    const schoolSubtitleStyle = {
        fontSize: '13px',
        color: '#4a6ee0',
        fontWeight: '600',
        marginBottom: '2px'
    };

    const systemNameStyle = {
        fontSize: '11px',
        color: '#7f8c8d',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginTop: '2px'
    };

    // Form title
    const formTitleStyle = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '6px',
        textAlign: 'center'
    };

    const formSubtitleStyle = {
        fontSize: '14px',
        color: '#666',
        marginBottom: '25px',
        textAlign: 'center',
        lineHeight: '1.4'
    };

    // Form elements
    const inputGroupStyle = {
        marginBottom: '18px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        border: '2px solid #e1e8ed',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: 'white',
        transition: 'all 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        boxSizing: 'border-box',
        outline: 'none'
    };

    const inputFocusStyle = {
        borderColor: '#4a6ee0',
        boxShadow: '0 0 0 3px rgba(74, 110, 224, 0.12)',
        outline: 'none'
    };

    const buttonStyle = {
        backgroundColor: '#4a6ee0',
        color: 'white',
        border: 'none',
        padding: '13px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        width: '100%',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 10px rgba(74, 110, 224, 0.25)',
        marginTop: '8px'
    };

    const buttonHoverStyle = {
        backgroundColor: '#3a5ed0',
        transform: 'translateY(-1px)',
        boxShadow: '0 5px 15px rgba(58, 94, 208, 0.3)'
    };

    const errorStyle = {
        color: '#e74c3c',
        backgroundColor: 'rgba(255, 235, 238, 0.9)',
        padding: '10px',
        borderRadius: '6px',
        marginTop: '12px',
        fontSize: '13px',
        border: '1px solid #ffcdd2',
        textAlign: 'center'
    };

    const infoStyle = {
        marginTop: '15px',
        fontSize: '12px',
        color: '#7f8c8d',
        padding: '10px',
        backgroundColor: 'rgba(248, 249, 250, 0.8)',
        borderRadius: '6px',
        border: '1px dashed #bdc3c7',
        textAlign: 'center',
        lineHeight: '1.4'
    };

    const handleNext = () => {
        if (!accountName.trim()) {
            setError('Please enter an account name');
            return;
        }

        if (accountName.trim().toLowerCase() !== 'raja') {
            setError('Account name must be "Raja" (case-insensitive)');
            return;
        }

        localStorage.setItem('accountName', accountName);
        navigate('/login');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleNext();
        }
    };

    return (
        <div style={pageContainerStyle}>
            <div style={overlayStyle}></div>

            <div style={formContainerStyle}>
                {/* Logo Section */}
                <div style={logoContainerStyle}>
                    <img
                        src="/images/school-logo.png"
                        alt="School Logo"
                        style={logoImageStyle}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234a6ee0'%3E%3Cpath d='M12 2L1 9v11h22V9L12 2zm0 2.8l9 5.2v9H3v-9l9-5.2zM12 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E";
                        }}
                    />
                    <div style={schoolNameStyle}>JEEVAN ADARSH VIDYALAYA</div>
                    <div style={schoolSubtitleStyle}>Education Excellence Since 1995</div>
                    <div style={systemNameStyle}>Teacher Panel</div>
                </div>

                {/* Form Title */}
                <h2 style={formTitleStyle}>Account Information</h2>
                <p style={formSubtitleStyle}>Enter your account name to proceed</p>

                {/* Input Field */}
                <div style={inputGroupStyle}>
                    <label htmlFor="accountName" style={labelStyle}>Account Name</label>
                    <input
                        type="text"
                        id="accountName"
                        placeholder="Enter account name"
                        value={accountName}
                        onChange={(e) => {
                            setAccountName(e.target.value);
                            setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        autoFocus
                        style={{
                            ...inputStyle,
                            ...(isInputFocused ? inputFocusStyle : {})
                        }}
                    />
                </div>

                {/* Next Button */}
                <button
                    style={{
                        ...buttonStyle,
                        ...(isButtonHovered ? buttonHoverStyle : {})
                    }}
                    onClick={handleNext}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                >
                    NEXT
                </button>

                {/* Error Message */}
                {error && <div style={errorStyle}>{error}</div>}

                {/* Info Box */}
                <div style={infoStyle}>
                    <p><strong>For testing:</strong> Enter "Raja" as account name</p>
                </div>
            </div>
        </div>
    );
};

export default AccountSetup;