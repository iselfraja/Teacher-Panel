import React, { useState, useEffect, useRef } from 'react';

const Profile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [showRenewConfirm, setShowRenewConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [showImageMenu, setShowImageMenu] = useState(false);

    // Snackbar state
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success', 'error', 'info'

    // Profile Data
    const [profileData, setProfileData] = useState({
        name: "Raja Prasad",
        phone: "9559789146",
        email: "iselfraja@gmail.com",
        subjects: "Computer Science",
        subscriptionStatus: "Active",
        validThru: "01/01/2025",
        expiryThru: "01/01/2026",
        daysLeft: 35
    });

    // Menu ke liye ref
    const menuRef = useRef(null);

    useEffect(() => {
        // Load saved profile image
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }

        // Load saved profile data if exists
        const savedProfileData = localStorage.getItem('profileData');
        if (savedProfileData) {
            setProfileData(JSON.parse(savedProfileData));
        }
    }, []);

    // Click outside menu close karne ke liye
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowImageMenu(false);
            }
        };

        if (showImageMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showImageMenu]);

    // Snackbar auto hide
    useEffect(() => {
        if (showSnackbar) {
            const timer = setTimeout(() => {
                setShowSnackbar(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSnackbar]);

    const showNotification = (message, type = 'success') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setShowSnackbar(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File size should be less than 5MB', 'error');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                showNotification('Only JPG, PNG, and GIF files are allowed', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                localStorage.setItem('profileImage', reader.result);
                showNotification('Profile photo updated successfully!');
            };
            reader.readAsDataURL(file);
        }
        setShowImageMenu(false);
    };

    const handleDeleteImage = () => {
        setShowImageMenu(false);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setProfileImage(null);
        localStorage.removeItem('profileImage');
        setShowDeleteConfirm(false);
        showNotification('Profile photo removed successfully!');
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleProfileImageClick = () => {
        setShowImageMenu(!showImageMenu);
    };

    const handleRequestRenewal = () => {
        setShowRenewConfirm(true);
    };

    const handleConfirmRenewal = () => {
        setShowRenewConfirm(false);
        showNotification('Renewal request has been submitted successfully!');
    };

    const handleCancelRenewal = () => {
        setShowRenewConfirm(false);
    };

    const handleEditProfile = () => {
        setEditedData({ ...profileData });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setProfileData(editedData);
        localStorage.setItem('profileData', JSON.stringify(editedData));
        setShowEditModal(false);
        showNotification('Profile updated successfully!');
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
    };

    const handleChangePassword = () => {
        showNotification('Change Password functionality will be implemented soon!', 'info');
    };

    const handleTwoFactorAuth = () => {
        showNotification('Two-Factor Authentication functionality will be implemented soon!', 'info');
    };

    const handleDownloadProfile = () => {
        // Create a JSON file for download
        const dataStr = JSON.stringify(profileData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'profile_data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showNotification('Profile data downloaded successfully!');
    };

    // Add CSS animation for snackbar
    useEffect(() => {
        if (!document.querySelector('#snackbar-animation')) {
            const keyframes = `
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
            `;

            const style = document.createElement('style');
            style.id = 'snackbar-animation';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
    }, []);

    // Snackbar Styles (Top position)
    const snackbarStyle = {
        position: 'fixed',
        top: '90px',
        left: '84%',
        transform: 'translateX(-50%)',
        backgroundColor: snackbarType === 'success' ? '#2ecc71' :
            snackbarType === 'error' ? '#e74c3c' : '#3498db',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '300px',
        maxWidth: '90vw',
        animation: 'fadeInDown 0.3s ease-out'
    };

    const snackbarMessageStyle = {
        fontSize: '14px',
        fontWeight: '500',
        flex: 1
    };

    const snackbarCloseStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        marginLeft: '15px',
        padding: '0',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)'
    };

    // Menu Styles
    const menuStyle = {
        position: 'absolute',
        top: '180px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '160px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden'
    };

    const menuItemStyle = {
        padding: '12px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#333',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'white',
        transition: 'background-color 0.2s'
    };

    // Compact Profile Page Styles
    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px 20px',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        position: 'relative'
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '10px',
        paddingBottom: '5px',
        borderBottom: '2px solid #e0e0e0'
    };

    const titleStyle = {
        fontSize: '25px',
        color: '#34495e',
        fontWeight: '600',
        marginTop: '0px'
    };

    const contentStyle = {
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    };

    const leftColumnStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
    };

    const profileImageContainerStyle = {
        textAlign: 'center',
        position: 'relative'
    };

    const profileImageStyle = {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid #3498db',
        marginBottom: '15px',
        cursor: 'pointer',
        backgroundColor: '#ecf0f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        color: '#3498db',
        fontWeight: 'bold',
        margin: '0 auto',
        transition: 'border-color 0.2s'
    };

    const profileImageHoverStyle = {
        border: '4px solid #2980b9'
    };

    const subscriptionBoxStyle = {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ddd'
    };

    const subscriptionTitleStyle = {
        fontSize: '16px',
        color: '#2c3e50',
        fontWeight: '600',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const subscriptionRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '13px'
    };

    const subscriptionLabelStyle = {
        color: '#7f8c8d'
    };

    const subscriptionValueStyle = {
        color: '#2c3e50',
        fontWeight: '500'
    };

    const statusBadgeStyle = {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: profileData.subscriptionStatus === 'Active' ? '#2ecc71' : '#e74c3c'
    };

    const daysBadgeStyle = {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: profileData.daysLeft > 30 ? '#2ecc71' :
            profileData.daysLeft > 10 ? '#f39c12' : '#e74c3c'
    };

    const rightColumnStyle = {
        display: 'flex',
        flexDirection: 'column'
    };

    const profileHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
    };

    const profileNameStyle = {
        fontSize: '22px',
        color: '#2c3e50',
        fontWeight: 'bold'
    };

    const editButtonStyle = {
        backgroundColor: '#f8f9fa',
        color: '#3498db',
        border: '1px solid #3498db',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s'
    };

    const detailsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginBottom: '20px'
    };

    const detailItemStyle = {
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #eee'
    };

    const detailLabelStyle = {
        fontSize: '12px',
        color: '#7f8c8d',
        marginBottom: '5px',
        display: 'block'
    };

    const detailValueStyle = {
        fontSize: '14px',
        color: '#2c3e50',
        fontWeight: '500',
        display: 'block',
        wordBreak: 'break-word'
    };

    const actionButtonsStyle = {
        display: 'flex',
        gap: '15px',
        marginTop: '20px'
    };

    const primaryButtonStyle = {
        flex: 1,
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background-color 0.2s'
    };

    const secondaryButtonStyle = {
        flex: 1,
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background-color 0.2s'
    };

    const securitySectionStyle = {
        marginTop: '25px',
        paddingTop: '20px',
        borderTop: '1px solid #eee'
    };

    const securityTitleStyle = {
        fontSize: '16px',
        color: '#2c3e50',
        fontWeight: '600',
        marginBottom: '15px'
    };

    const securityButtonsStyle = {
        display: 'flex',
        gap: '10px'
    };

    const securityButtonStyle = {
        flex: 1,
        backgroundColor: '#f8f9fa',
        color: '#2c3e50',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s'
    };

    // Modal Styles
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20000,
        backdropFilter: 'blur(2px)'
    };

    const modalStyle = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        width: '350px',
        maxWidth: '90vw',
        textAlign: 'center'
    };

    const editModalStyle = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        width: '400px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto'
    };

    const modalTitleStyle = {
        color: '#2c3e50',
        marginBottom: '15px',
        fontSize: '18px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    };

    const modalMessageStyle = {
        color: '#7f8c8d',
        marginBottom: '20px',
        fontSize: '14px',
        lineHeight: '1.5'
    };

    const modalButtonGroupStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
    };

    const modalButtonStyle = (isPrimary, isDanger = false) => ({
        backgroundColor: isDanger ? '#e74c3c' : isPrimary ? '#2ecc71' : '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        minWidth: '80px',
        transition: 'background-color 0.2s'
    });

    const fileInputStyle = {
        display: 'none'
    };

    const editFormStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px'
    };

    const formGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    };

    const formLabelStyle = {
        fontSize: '13px',
        color: '#2c3e50',
        fontWeight: '500',
        textAlign: 'left'
    };

    const formInputStyle = {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '13px',
        width: '100%',
        boxSizing: 'border-box'
    };

    return (
        <div style={containerStyle}>
            {/* Snackbar Notification (Top) */}
            {showSnackbar && (
                <div style={snackbarStyle}>
                    <div style={snackbarMessageStyle}>{snackbarMessage}</div>
                    <button
                        style={snackbarCloseStyle}
                        onClick={() => setShowSnackbar(false)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Header with School Info */}
            <div style={headerStyle}>
                <div style={titleStyle}>PROFILE DETAILS</div>
            </div>

            {/* Main Content */}
            <div style={contentStyle}>
                {/* Left Column - Profile Image & Subscription */}
                <div style={leftColumnStyle}>
                    {/* Profile Image with Menu */}
                    <div style={profileImageContainerStyle}>
                        <div
                            style={{
                                ...profileImageStyle,
                                ...(showImageMenu ? profileImageHoverStyle : {}),
                                backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                            onClick={handleProfileImageClick}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2980b9'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3498db'}
                        >
                            {!profileImage && profileData.name.charAt(0)}
                        </div>

                        {/* Image Options Menu */}
                        {showImageMenu && (
                            <div ref={menuRef} style={menuStyle}>
                                <label style={menuItemStyle}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={handleImageUpload}
                                        style={fileInputStyle}
                                    />
                                    📷 Change Photo
                                </label>
                                {profileImage && (
                                    <div
                                        style={menuItemStyle}
                                        onClick={handleDeleteImage}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        🗑️ Remove Photo
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '10px' }}>
                            Click on photo to change or remove
                        </div>
                        <div style={{ fontSize: '11px', color: '#95a5a6', marginTop: '5px' }}>
                            JPG, PNG, GIF • Max 5MB
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div style={subscriptionBoxStyle}>
                        <div style={subscriptionTitleStyle}>
                            ⭐ Subscription Status
                        </div>

                        <div style={subscriptionRowStyle}>
                            <span style={subscriptionLabelStyle}>Status:</span>
                            <span style={statusBadgeStyle}>
                                {profileData.subscriptionStatus}
                            </span>
                        </div>

                        <div style={subscriptionRowStyle}>
                            <span style={subscriptionLabelStyle}>Valid From:</span>
                            <span style={subscriptionValueStyle}>{profileData.validThru}</span>
                        </div>

                        <div style={subscriptionRowStyle}>
                            <span style={subscriptionLabelStyle}>Expiry:</span>
                            <span style={subscriptionValueStyle}>{profileData.expiryThru}</span>
                        </div>

                        <div style={subscriptionRowStyle}>
                            <span style={subscriptionLabelStyle}>Days Left:</span>
                            <span style={daysBadgeStyle}>
                                {profileData.daysLeft} days
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Profile Details */}
                <div style={rightColumnStyle}>
                    {/* Profile Header with Edit Button */}
                    <div style={profileHeaderStyle}>
                        <div style={profileNameStyle}>{profileData.name}</div>
                        <button
                            style={editButtonStyle}
                            onClick={handleEditProfile}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f4fc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        >
                            ✏️ Edit Profile
                        </button>
                    </div>

                    {/* Profile Details Grid */}
                    <div style={detailsGridStyle}>
                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Phone Number</span>
                            <span style={detailValueStyle}>{profileData.phone}</span>
                        </div>
                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Email Address</span>
                            <span style={detailValueStyle}>{profileData.email}</span>
                        </div>
                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Subjects</span>
                            <span style={detailValueStyle}>{profileData.subjects}</span>
                        </div>
                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Account Type</span>
                            <span style={detailValueStyle}>Premium</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={actionButtonsStyle}>
                        <button
                            style={primaryButtonStyle}
                            onClick={handleRequestRenewal}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
                        >
                            🔄 Request Renewal
                        </button>
                        <button
                            style={secondaryButtonStyle}
                            onClick={handleDownloadProfile}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                        >
                            📥 Download Profile
                        </button>
                    </div>

                    {/* Security Section */}
                    <div style={securitySectionStyle}>
                        <div style={securityTitleStyle}>Account Security</div>
                        <div style={securityButtonsStyle}>
                            <button
                                style={securityButtonStyle}
                                onClick={handleChangePassword}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f4fc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            >
                                🔒 Change Password
                            </button>
                            <button
                                style={securityButtonStyle}
                                onClick={handleTwoFactorAuth}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f4fc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            >
                                📱 Two-Factor Auth
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renewal Confirmation Modal */}
            {showRenewConfirm && (
                <div style={modalOverlayStyle} onClick={handleCancelRenewal}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={modalTitleStyle}>
                            🔄 Confirm Renewal
                        </h3>
                        <p style={modalMessageStyle}>
                            Are you sure you want to request renewal for your subscription?
                        </p>
                        <div style={modalButtonGroupStyle}>
                            <button
                                style={modalButtonStyle(false)}
                                onClick={handleCancelRenewal}
                            >
                                Cancel
                            </button>
                            <button
                                style={modalButtonStyle(true)}
                                onClick={handleConfirmRenewal}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Photo Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={modalOverlayStyle} onClick={handleCancelDelete}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={modalTitleStyle}>
                            🗑️ Remove Photo
                        </h3>
                        <p style={modalMessageStyle}>
                            Are you sure you want to remove your profile photo?
                        </p>
                        <div style={modalButtonGroupStyle}>
                            <button
                                style={modalButtonStyle(false)}
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                style={modalButtonStyle(true, true)}
                                onClick={handleConfirmDelete}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div style={modalOverlayStyle} onClick={handleCancelEdit}>
                    <div style={editModalStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={modalTitleStyle}>
                            ✏️ Edit Profile
                        </h3>
                        <div style={editFormStyle}>
                            <div style={formGroupStyle}>
                                <label style={formLabelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    value={editedData.name || ''}
                                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                                    style={formInputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={formLabelStyle}>Phone Number</label>
                                <input
                                    type="text"
                                    value={editedData.phone || ''}
                                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                                    style={formInputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={formLabelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    value={editedData.email || ''}
                                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                    style={formInputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={formLabelStyle}>Subjects</label>
                                <input
                                    type="text"
                                    value={editedData.subjects || ''}
                                    onChange={(e) => setEditedData({ ...editedData, subjects: e.target.value })}
                                    style={formInputStyle}
                                />
                            </div>
                        </div>
                        <div style={modalButtonGroupStyle}>
                            <button
                                style={modalButtonStyle(false)}
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                            <button
                                style={modalButtonStyle(true)}
                                onClick={handleSaveEdit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;