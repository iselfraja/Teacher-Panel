import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [accountName, setAccountName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedAccountName = localStorage.getItem('accountName');
        if (!storedAccountName) {
            navigate('/');
        } else {
            setAccountName(storedAccountName);
        }
    }, [navigate]);

    // State for hover effects
    const [isUserInputFocused, setIsUserInputFocused] = useState(false);
    const [isPassInputFocused, setIsPassInputFocused] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    // Main container
    const pageContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundImage: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1
    };

    // Compact form container
    const formContainerStyle = {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '380px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: '25px 22px',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden'
    };

    // Logo container
    const logoContainerStyle = {
        textAlign: 'center',
        marginBottom: '20px'
    };

    const logoImageStyle = {
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #4a6ee0',
        boxShadow: '0 3px 8px rgba(74, 110, 224, 0.25)',
        marginBottom: '10px'
    };

    const schoolNameStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '3px',
        lineHeight: '1.2'
    };

    const schoolSubtitleStyle = {
        fontSize: '12px',
        color: '#4a6ee0',
        fontWeight: '600',
        marginBottom: '2px'
    };

    const systemNameStyle = {
        fontSize: '10px',
        color: '#7f8c8d',
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        marginTop: '2px'
    };

    // Form title
    const formTitleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '5px',
        textAlign: 'center'
    };

    const accountInfoStyle = {
        fontSize: '12px',
        color: '#4a6ee0',
        marginBottom: '18px',
        textAlign: 'center',
        padding: '8px 10px',
        backgroundColor: 'rgba(74, 110, 224, 0.08)',
        borderRadius: '6px',
        fontWeight: '600'
    };

    // Form elements
    const inputGroupStyle = {
        marginBottom: '16px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: '13px'
    };

    const inputStyle = {
        width: '100%',
        padding: '11px 14px',
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
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        width: '100%',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 8px rgba(74, 110, 224, 0.25)',
        marginTop: '8px'
    };

    const buttonHoverStyle = {
        backgroundColor: '#3a5ed0',
        transform: 'translateY(-1px)',
        boxShadow: '0 5px 12px rgba(58, 94, 208, 0.3)'
    };

    const errorStyle = {
        color: '#e74c3c',
        backgroundColor: 'rgba(255, 235, 238, 0.9)',
        padding: '10px',
        borderRadius: '6px',
        marginTop: '10px',
        fontSize: '12px',
        border: '1px solid #ffcdd2',
        textAlign: 'center'
    };

    const infoStyle = {
        marginTop: '12px',
        fontSize: '11px',
        color: '#7f8c8d',
        padding: '8px 10px',
        backgroundColor: 'rgba(248, 249, 250, 0.8)',
        borderRadius: '6px',
        border: '1px dashed #bdc3c7',
        textAlign: 'center',
        lineHeight: '1.4'
    };

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        if (username !== 'iselfraja' || password !== 'Raja@123') {
            setError('Invalid username or password. Use: iselfraja / Raja@123');
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        navigate('/dashboard');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
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
                <h2 style={formTitleStyle}>Login</h2>
                <div style={accountInfoStyle}>Account: {accountName}</div>

                {/* Username Input */}
                <div style={inputGroupStyle}>
                    <label htmlFor="username" style={labelStyle}>Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsUserInputFocused(true)}
                        onBlur={() => setIsUserInputFocused(false)}
                        autoFocus
                        style={{
                            ...inputStyle,
                            ...(isUserInputFocused ? inputFocusStyle : {})
                        }}
                    />
                </div>

                {/* Password Input */}
                <div style={inputGroupStyle}>
                    <label htmlFor="password" style={labelStyle}>Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsPassInputFocused(true)}
                        onBlur={() => setIsPassInputFocused(false)}
                        style={{
                            ...inputStyle,
                            ...(isPassInputFocused ? inputFocusStyle : {})
                        }}
                    />
                </div>

                {/* Error Message */}
                {error && <div style={errorStyle}>{error}</div>}

                {/* Login Button */}
                <button
                    style={{
                        ...buttonStyle,
                        ...(isButtonHovered ? buttonHoverStyle : {})
                    }}
                    onClick={handleLogin}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                >
                    LOGIN
                </button>

                {/* Info Box */}
                <div style={infoStyle}>
                    <p><strong>Test Credentials:</strong> iselfraja / Raja@123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;