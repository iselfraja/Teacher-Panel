import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // Warning के लिए 60 seconds
    const navigate = useNavigate();
    const location = useLocation();

    // Refs for timers
    const inactivityTimerRef = useRef(null);
    const warningTimerRef = useRef(null);
    const profileMenuTimeoutRef = useRef(null);

    // Inactivity timeout duration (1 hour = 3600000 ms)
    const INACTIVITY_TIMEOUT = 3600000; // 1 hour

    // Automatic logout handler
    const handleAutoLogout = useCallback(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        setShowLogoutWarning(false);

        if (warningTimerRef.current) clearInterval(warningTimerRef.current);
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

        navigate('/');
    }, [navigate]);

    // Warning modal दिखाने का function
    const showLogoutWarningModal = useCallback(() => {
        setShowLogoutWarning(true);
        setTimeLeft(60); // Reset to 60 seconds

        // Countdown timer start करें
        const countdown = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    handleAutoLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        warningTimerRef.current = countdown;
    }, [handleAutoLogout]);

    // Inactivity timer start करने का function
    const startInactivityTimer = useCallback(() => {
        // पहले के timers clear करें
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        if (warningTimerRef.current) clearInterval(warningTimerRef.current);
        setShowLogoutWarning(false);

        // नया inactivity timer सेट करें
        const timer = setTimeout(() => {
            showLogoutWarningModal();
        }, INACTIVITY_TIMEOUT);

        inactivityTimerRef.current = timer;
    }, [INACTIVITY_TIMEOUT, showLogoutWarningModal]);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const storedUsername = localStorage.getItem('username');

        if (!isLoggedIn || !storedUsername) {
            navigate('/login');
        } else {
            setUsername(storedUsername);
            // User activity ट्रैक करने के लिए event listeners
            startInactivityTimer();
        }

        return () => {
            // Cleanup timers
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
            if (warningTimerRef.current) clearInterval(warningTimerRef.current);
            if (profileMenuTimeoutRef.current) clearTimeout(profileMenuTimeoutRef.current);
        };
    }, [navigate, startInactivityTimer]);

    // Warning modal में "Stay Logged In" button handler
    const handleStayLoggedIn = useCallback(() => {
        setShowLogoutWarning(false);
        if (warningTimerRef.current) clearInterval(warningTimerRef.current);
        startInactivityTimer();
    }, [startInactivityTimer]);

    // User activity events add करें
    useEffect(() => {
        const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        const handleActivity = () => {
            if (!showLogoutWarning) {
                startInactivityTimer();
            }
        };

        // Event listeners add करें
        activityEvents.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup function
        return () => {
            activityEvents.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [showLogoutWarning, startInactivityTimer]);

    // Profile menu को बंद करने के लिए mouse leave
    const handleAvatarMouseEnter = () => {
        if (profileMenuTimeoutRef.current) {
            clearTimeout(profileMenuTimeoutRef.current);
            profileMenuTimeoutRef.current = null;
        }
        setShowProfileMenu(true);
    };

    const handleAvatarMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowProfileMenu(false);
        }, 300);
        profileMenuTimeoutRef.current = timeout;
    };

    const handleProfileMenuMouseEnter = () => {
        if (profileMenuTimeoutRef.current) {
            clearTimeout(profileMenuTimeoutRef.current);
            profileMenuTimeoutRef.current = null;
        }
    };

    const handleProfileMenuMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowProfileMenu(false);
        }, 200);
        profileMenuTimeoutRef.current = timeout;
    };

    const getCurrentTitle = () => {
        const path = location.pathname;

        const titleMap = {
            '/dashboard': 'Dashboard',
            '/classroom': 'Classroom Management',
            '/timetable': 'Time Table',
            '/attendance': 'Attendance',
            '/examination': 'Examination',
            '/profile': 'My Profile',
            '/assignment-create': 'Assignment - Create',
            '/assignment-view': 'Assignment - View',
            '/chat': 'Student Details - Chat',
            '/view-admit-card': 'Student Details - Admit Card',
            '/view-announcements': 'Student Details - Announcement',
            '/lesson': 'Study Material - Lesson',
            '/topic': 'Study Material - Topic'
        };

        return titleMap[path] || 'Dashboard';
    };

    // Handle profile menu click
    const handleProfileMenuClick = () => {
        navigate('/profile');
        setShowProfileMenu(false);
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === '1') {
                e.preventDefault();
                navigate('/dashboard');
            }
            else if (e.ctrlKey && e.key === '2') {
                e.preventDefault();
                navigate('/assignment-create');
            }
            else if (e.ctrlKey && e.key === '3') {
                e.preventDefault();
                navigate('/assignment-view');
            }
            else if (e.ctrlKey && e.key === '4') {
                e.preventDefault();
                navigate('/chat');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    // Auto Logout Warning Modal के लिए styles
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20000,
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease-out'
    };

    const modalStyle = {
        backgroundColor: 'white',
        padding: '35px 40px',
        borderRadius: '20px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)',
        width: '450px',
        textAlign: 'center',
        animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #e5e7eb',
        maxWidth: '90vw'
    };

    const modalTitleStyle = {
        color: '#dc2626',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px'
    };

    const modalMessageStyle = {
        color: '#4b5563',
        marginBottom: '25px',
        fontSize: '16px',
        lineHeight: '1.6'
    };

    const countdownStyle = {
        fontSize: '32px',
        fontWeight: '800',
        color: '#dc2626',
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        border: '2px dashed #fca5a5',
        fontFamily: "'Courier New', monospace"
    };

    const modalButtonGroupStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '25px'
    };

    const modalButtonStyle = (isPrimary) => ({
        backgroundColor: isPrimary ? '#dc2626' : '#10b981',
        color: 'white',
        border: 'none',
        padding: '14px 28px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s',
        minWidth: '160px',
        flex: '1',
        boxShadow: isPrimary ? '0 4px 15px rgba(220, 38, 38, 0.3)' : '0 4px 15px rgba(16, 185, 129, 0.3)',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: isPrimary ? '0 8px 25px rgba(220, 38, 38, 0.4)' : '0 8px 25px rgba(16, 185, 129, 0.4)'
        }
    });

    const warningIconStyle = {
        fontSize: '48px',
        animation: 'pulse 2s infinite'
    };

    // Add animation styles
    const animationStyle = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { 
                opacity: 0; 
                transform: translateY(-30px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes countdownPulse {
            0% { color: #dc2626; }
            50% { color: #ef4444; }
            100% { color: #dc2626; }
        }
    `;

    // Main content style
    const mainContentStyle = {
        marginLeft: '280px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    };

    const dashboardHeaderStyle = {
        backgroundColor: 'white',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: '0',
        zIndex: '999',
        flexShrink: '0',
        borderBottom: '1px solid #eef2f6'
    };

    const headerTitleStyle = {
        fontSize: '26px',
        color: '#1a1f36',
        marginBottom: '8px',
        fontWeight: '700',
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const headerSubtitleStyle = {
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const userInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        position: 'relative'
    };

    const welcomeTextStyle = {
        fontWeight: '600',
        color: '#374151',
        fontSize: '15px',
        padding: '10px 20px',
        backgroundColor: '#f3f4f6',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const userAvatarStyle = {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        fontSize: '16px',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease'
    };

    const profileMenuStyle = {
        position: 'absolute',
        top: '55px',
        right: '0',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        minWidth: '180px',
        overflow: 'hidden',
        border: '1px solid #eef2f6',
        animation: 'fadeInDown 0.2s ease-out'
    };

    const profileMenuItemStyle = {
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#374151',
        fontWeight: '500',
        backgroundColor: 'white',
        transition: 'all 0.2s ease',
        borderBottom: '1px solid #f8fafc',
        '&:hover': {
            backgroundColor: '#f8fafc',
            paddingLeft: '25px'
        },
        '&:last-child': {
            borderBottom: 'none'
        }
    };

    const profileMenuIconStyle = {
        fontSize: '16px',
        width: '20px',
        textAlign: 'center',
        color: '#667eea'
    };

    return (
        <>
            <style>{animationStyle}</style>

            <div style={{
                fontFamily: "'Inter', sans-serif",
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
                <Sidebar />

                <div style={mainContentStyle} className="main-content">
                    <header style={dashboardHeaderStyle} className="dashboard-header">
                        <div>
                            <h1 style={headerTitleStyle}>JEEVAN ADARSH VIDYALAYA</h1>
                            <p style={headerSubtitleStyle}>
                                <span style={{
                                    padding: '4px 12px',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    🧑‍🏫 Teacher Panel
                                </span>
                                <span style={{ color: '#d1d5db' }}> • </span>
                                <span>{getCurrentTitle()}</span>
                            </p>
                        </div>
                        <div style={userInfoStyle} className="user-info">
                            <div style={welcomeTextStyle}>
                                <span>👋</span>
                                Welcome, {username.toUpperCase()}!
                            </div>
                            <div
                                className="profile-menu-container"
                                style={{ position: 'relative' }}
                                onMouseEnter={handleAvatarMouseEnter}
                                onMouseLeave={handleAvatarMouseLeave}
                            >
                                <div
                                    style={{
                                        ...userAvatarStyle,
                                        transform: showProfileMenu ? 'scale(1.05)' : 'scale(1)',
                                        boxShadow: showProfileMenu
                                            ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                                            : '0 4px 15px rgba(102, 126, 234, 0.3)'
                                    }}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    {username.charAt(0).toUpperCase()}
                                </div>

                                {/* Profile Dropdown Menu */}
                                {showProfileMenu && (
                                    <div
                                        style={profileMenuStyle}
                                        onMouseEnter={handleProfileMenuMouseEnter}
                                        onMouseLeave={handleProfileMenuMouseLeave}
                                    >
                                        <div
                                            style={profileMenuItemStyle}
                                            onClick={handleProfileMenuClick}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            <span style={profileMenuIconStyle}>👤</span>
                                            <span>My Profile</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <div style={{
                        padding: '35px 40px',
                        flex: '1',
                        overflowY: 'auto',
                        animation: 'fadeIn 0.3s ease-out'
                    }} className="dashboard-content">
                        <Outlet />
                    </div>

                    {/* Footer */}
                    <footer style={{
                        backgroundColor: 'white',
                        padding: '20px 40px',
                        borderTop: '1px solid #eef2f6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#6b7280',
                        flexShrink: '0'
                    }}>
                        <div>
                            © 2025 Jeevan Adarsh Vidyalaya. All rights reserved.
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span>Version: 2.1.0</span>
                            <span>•</span>
                            <span>Teacher Portal</span>
                            {location.pathname === '/assignment-create' && (
                                <>
                                    <span>•</span>
                                    <span style={{ color: '#4a6ee0', fontWeight: '600' }}>
                                        Assignment Creation Mode
                                    </span>
                                </>
                            )}
                            {location.pathname === '/assignment-view' && (
                                <>
                                    <span>•</span>
                                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                                        Assignment View Mode
                                    </span>
                                </>
                            )}
                            {location.pathname === '/chat' && (
                                <>
                                    <span>•</span>
                                    <span style={{ color: '#667eea', fontWeight: '600' }}>
                                        Live Chat Mode | Ctrl+4
                                    </span>
                                </>
                            )}
                        </div>
                    </footer>
                </div>

                {/* Auto Logout Warning Modal */}
                {showLogoutWarning && (
                    <div style={modalOverlayStyle}>
                        <div style={modalStyle}>
                            <div style={warningIconStyle}>⚠️</div>
                            <h3 style={modalTitleStyle}>Session Timeout Warning</h3>
                            <p style={modalMessageStyle}>
                                Your session will expire due to inactivity.
                                You will be automatically logged out in:
                            </p>
                            <div style={countdownStyle}>
                                {timeLeft} seconds
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '10px' }}>
                                Move your mouse or press any key to stay logged in
                            </p>
                            <div style={modalButtonGroupStyle}>
                                <button
                                    style={modalButtonStyle(false)}
                                    onClick={handleStayLoggedIn}
                                >
                                    Stay Logged In
                                </button>
                                <button
                                    style={modalButtonStyle(true)}
                                    onClick={handleAutoLogout}
                                >
                                    Logout Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;