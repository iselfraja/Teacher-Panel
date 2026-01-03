import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState([]);
    const [hoveredMenu, setHoveredMenu] = useState(null);

    // Sidebar.js में menuStructure को update करें
    const menuStructure = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: '📊',
            subMenus: [],
            path: '/dashboard'
        },
        {
            id: 'classroom',
            name: 'Classroom Management',
            icon: '🏫',
            subMenus: [],
            path: '/classroom'
        },
        {
            id: 'timetable',
            name: 'Time Table',
            icon: '⏰',
            subMenus: [],
            path: '/timetable'
        },
        {
            id: 'students',
            name: 'Student Details',
            icon: '👨‍🎓',
            subMenus: [
                { id: 'admit-card', name: 'Admit Card', icon: '🎫', path: '/view-admit-card' },
                { id: 'chat', name: 'Chat', icon: '💬', path: '/chat' },
                { id: 'announcement', name: 'Announcement', icon: '📢', path: '/view-announcements' }
            ]
        },
        {
            id: 'attendance',
            name: 'Attendance',
            icon: '✓',
            subMenus: [],
            path: '/attendance'
        },
        {
            id: 'study-material',
            name: 'Study Material',
            icon: '📚',
            subMenus: [
                { id: 'lesson', name: 'Lesson', icon: '📖', path: '/lesson' },
                { id: 'topic', name: 'Topic', icon: '📝', path: '/topic' }
            ]
        },
        {
            id: 'assignment',
            name: 'Assignment',
            icon: '📝',
            subMenus: [
                { id: 'create-assignment', name: 'Assignment Create', icon: '➕', path: '/assignment-create' },
                { id: 'assignment-details', name: 'Assignment View', icon: '👁️', path: '/assignment-view' }
            ]
        },
        {
            id: 'examination',
            name: 'Examination',
            icon: '📋',
            subMenus: [],
            path: '/examination'
        }
    ];

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleMainMenuClick = (menu) => {
        const hasSubMenus = menu.subMenus && menu.subMenus.length > 0;
        const nonClickableMenus = ['students', 'study-material', 'assignment'];

        if (hasSubMenus) {
            if (nonClickableMenus.includes(menu.id)) {
                // These menus should only expand/collapse
                toggleMenu(menu.id);
            } else {
                // Other menus with submenus navigate to their path
                if (menu.path) {
                    navigate(menu.path);
                }
            }
        } else {
            // For menus without submenus, navigate directly
            if (menu.path) {
                navigate(menu.path);
            }
        }
    };

    const handleSubMenuClick = (subMenu) => {
        navigate(subMenu.path);
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        setShowLogoutConfirm(false);
        navigate('/');
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const isMenuActive = (menu) => {
        if (menu.path) {
            return location.pathname === menu.path;
        }

        // Check if any submenu is active
        if (menu.subMenus && menu.subMenus.length > 0) {
            return menu.subMenus.some(subMenu => location.pathname === subMenu.path);
        }

        return false;
    };

    // Helper function to check if submenu is active
    const checkSubMenuActive = (subMenu) => {
        return location.pathname === subMenu.path;
    };

    // ================= STYLES =================

    const sidebarStyle = {
        width: '280px',
        background: 'linear-gradient(180deg, #1a1f36 0%, #111827 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '5px 0 30px rgba(0, 0, 0, 0.15)',
        zIndex: '1000',
        fontFamily: "'Inter', sans-serif"
    };

    const sidebarHeaderStyle = {
        padding: '10px 25px',
        borderBottom: '1px solid #2d3748',
        position: 'sticky',
        top: '0',
        backgroundColor: '#1a1f36',
        zIndex: '1001',
        backdropFilter: 'blur(10px)'
    };

    const sidebarHeaderTitleStyle = {
        fontSize: '32px',
        marginBottom: '8px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px'
    };

    const sidebarHeaderSubtitleStyle = {
        fontSize: '13px',
        color: '#9ca3af',
        fontWeight: '500',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    };

    const sidebarMenuStyle = {
        flex: '1',
        padding: '25px 0',
        overflowY: 'auto'
    };

    const menuListStyle = {
        listStyle: 'none',
        margin: '0',
        padding: '0 15px'
    };

    const menuItemStyle = (isActive, isHovered) => ({
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isActive ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
        borderLeft: isActive ? '4px solid #667eea' : '4px solid transparent',
        borderRadius: '12px',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            transition: 'left 0.6s'
        },
        '&:hover::before': {
            left: '100%'
        },
        transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
        boxShadow: isActive ? '0 4px 20px rgba(102, 126, 234, 0.2)' : 'none'
    });

    const menuIconStyle = {
        fontSize: '20px',
        marginRight: '15px',
        width: '24px',
        textAlign: 'center',
        transition: 'transform 0.3s'
    };

    const menuTextStyle = {
        fontSize: '15px',
        fontWeight: '500',
        flex: '1'
    };

    const subMenuListStyle = {
        listStyle: 'none',
        margin: '0 0 0 30px',
        padding: '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    const subMenuItemStyle = (isActive) => ({
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
        borderRadius: '10px',
        marginBottom: '4px',
        fontSize: '14px',
        borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
        position: 'relative',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateX(5px)'
        }
    });

    const expandIconStyle = {
        marginLeft: 'auto',
        fontSize: '12px',
        transition: 'transform 0.3s',
        color: '#9ca3af'
    };

    const fixedLogoutContainerStyle = {
        position: 'sticky',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '20px 25px',
        backgroundColor: 'rgba(26, 31, 54, 0.9)',
        borderTop: '1px solid #2d3748',
        marginTop: 'auto',
        zIndex: '1002',
        backdropFilter: 'blur(10px)'
    };

    const logoutButtonStyle = {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.6s'
        },
        '&:hover::before': {
            left: '100%'
        }
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)'
    };

    const modalStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '380px',
        textAlign: 'center',
        animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #e5e7eb'
    };

    const modalTitleStyle = {
        color: '#1a1f36',
        marginBottom: '15px',
        fontSize: '20px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    };

    const modalMessageStyle = {
        color: '#6b7280',
        marginBottom: '30px',
        fontSize: '15px',
        lineHeight: '1.6'
    };

    const modalButtonGroupStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px'
    };

    const modalButtonStyle = (isPrimary) => ({
        backgroundColor: isPrimary ? '#ef4444' : '#f3f4f6',
        color: isPrimary ? 'white' : '#374151',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s',
        minWidth: '100px',
        flex: '1',
        boxShadow: isPrimary ? '0 4px 15px rgba(239, 68, 68, 0.3)' : 'none',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isPrimary ? '0 6px 20px rgba(239, 68, 68, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
    });

    const animationStyle = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
        }
    `;

    return (
        <>
            <style>{animationStyle}</style>

            <div style={sidebarStyle}>
                <div style={sidebarHeaderStyle}>
                    <h2 style={sidebarHeaderTitleStyle}>JAV</h2>
                    <p style={sidebarHeaderSubtitleStyle}>Teacher Panel</p>
                </div>

                <div style={sidebarMenuStyle}>
                    <ul style={menuListStyle}>
                        {menuStructure.map((menu) => {
                            const isExpanded = expandedMenus.includes(menu.id);
                            const isActive = isMenuActive(menu);
                            const hasSubMenus = menu.subMenus && menu.subMenus.length > 0;
                            const isHovered = hoveredMenu === menu.id;

                            return (
                                <React.Fragment key={menu.id}>
                                    <li
                                        style={{
                                            ...menuItemStyle(isActive, isHovered),
                                            transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                                            boxShadow: isActive ? '0 4px 20px rgba(102, 126, 234, 0.2)' : 'none'
                                        }}
                                        onClick={() => handleMainMenuClick(menu)}
                                        onMouseEnter={() => setHoveredMenu(menu.id)}
                                        onMouseLeave={() => setHoveredMenu(null)}
                                    >
                                        <span style={{
                                            ...menuIconStyle,
                                            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)'
                                        }}>
                                            {menu.icon}
                                        </span>
                                        <span style={menuTextStyle}>{menu.name}</span>
                                        {hasSubMenus && (
                                            <span style={{
                                                ...expandIconStyle,
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}>
                                                ▼
                                            </span>
                                        )}
                                    </li>

                                    {hasSubMenus && (
                                        <ul style={{
                                            ...subMenuListStyle,
                                            maxHeight: isExpanded ? `${menu.subMenus.length * 45}px` : '0px'
                                        }}>
                                            {menu.subMenus.map((subMenuItem) => {
                                                const isSubMenuActive = checkSubMenuActive(subMenuItem);
                                                return (
                                                    <li
                                                        key={subMenuItem.id}
                                                        style={subMenuItemStyle(isSubMenuActive)}
                                                        onClick={() => handleSubMenuClick(subMenuItem)}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = isSubMenuActive
                                                                ? 'rgba(102, 126, 234, 0.1)'
                                                                : 'transparent';
                                                        }}
                                                    >
                                                        <span style={{ ...menuIconStyle, fontSize: '16px' }}>{subMenuItem.icon}</span>
                                                        <span style={menuTextStyle}>{subMenuItem.name}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </ul>
                </div>

                <div style={fixedLogoutContainerStyle}>
                    <button
                        style={logoutButtonStyle}
                        onClick={handleLogoutClick}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                        }}
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </div>

            {showLogoutConfirm && (
                <div style={modalOverlayStyle} onClick={handleCancelLogout}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={modalTitleStyle}>
                            <span>⚠️</span>
                            Confirm Logout
                        </h3>
                        <p style={modalMessageStyle}>
                            Are you sure you want to logout from<br />
                            <strong style={{ color: '#1a1f36' }}>Teacher Panel</strong>?
                        </p>
                        <div style={modalButtonGroupStyle}>
                            <button
                                style={modalButtonStyle(false)}
                                onClick={handleCancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                style={modalButtonStyle(true)}
                                onClick={handleConfirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;