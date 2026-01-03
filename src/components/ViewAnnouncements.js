import React, { useState } from 'react';

// Snackbar Component
const Snackbar = ({ message, type, onClose }) => {
    const snackbarStyles = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px',
        zIndex: 1000,
        minWidth: '300px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
    };

    const messageStyle = {
        flex: 1,
        fontSize: '14px',
        fontWeight: '500',
    };

    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1',
    };

    const iconStyle = {
        fontSize: '18px',
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '📢';
        }
    };

    return (
        <div style={snackbarStyles}>
            <span style={iconStyle}>{getIcon()}</span>
            <span style={messageStyle}>{message}</span>
            <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
    );
};

const ViewAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Annual Day Celebration',
            content: 'School will remain closed on 26th January for Republic Day celebration. Annual day function will be held on 28th January.',
            category: 'Holiday',
            priority: 'high',
            date: '2024-01-20',
            author: 'Principal',
            target: 'All Students',
            attachments: ['Program Schedule.pdf']
        },
        {
            id: 2,
            title: 'Parent-Teacher Meeting',
            content: 'PTM for classes 9th to 12th will be held on 5th February from 10:00 AM to 2:00 PM. All parents are requested to attend.',
            category: 'Academic',
            priority: 'medium',
            date: '2024-01-18',
            author: 'Academic Head',
            target: 'Classes 9-12',
            attachments: ['PTM_Schedule.pdf', 'Report_Card_Format.docx']
        },
        {
            id: 3,
            title: 'Sports Day Registration',
            content: 'Registration for annual sports day is open. Last date for registration is 25th January. Events include athletics, cricket, basketball and more.',
            category: 'Sports',
            priority: 'medium',
            date: '2024-01-15',
            author: 'Sports Department',
            target: 'All Students',
            attachments: ['Sports_Events.pdf', 'Registration_Form.pdf']
        },
        {
            id: 4,
            title: 'Library Timings Changed',
            content: 'Library will remain open from 8:00 AM to 5:00 PM during examination period. Saturday timings: 9:00 AM to 1:00 PM.',
            category: 'General',
            priority: 'low',
            date: '2024-01-12',
            author: 'Librarian',
            target: 'All Students & Staff',
            attachments: []
        },
        {
            id: 5,
            title: 'Science Exhibition',
            content: 'Inter-school science exhibition will be held on 15th February. Students interested in participating should contact Science department.',
            category: 'Academic',
            priority: 'high',
            date: '2024-01-10',
            author: 'Science Department',
            target: 'Science Students',
            attachments: ['Exhibition_Guidelines.pdf']
        },
    ]);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        category: 'General',
        priority: 'medium',
        targetUser: 'parent',
        targetClass: 'Nur',
        targetSection: 'B',
        attachments: []
    });

    const [filters, setFilters] = useState({
        category: 'all',
        priority: 'all',
        dateRange: 'all'
    });

    const [showForm, setShowForm] = useState(false);
    const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: 'info'
    });

    // State for delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        id: null,
        title: ''
    });

    const categories = ['All Categories', 'Academic', 'Holiday', 'Sports', 'General', 'Examination', 'Event'];
    const userTypes = ['parent', 'teacher', 'student', 'all'];
    const classes = ['Nur', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const sections = ['A', 'B', 'C', 'D', 'All'];

    // Show snackbar function
    const showSnackbar = (message, type = 'info') => {
        setSnackbar({
            show: true,
            message,
            type
        });

        // Auto hide after 4 seconds
        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, show: false }));
        }, 4000);
    };

    // Close snackbar manually
    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, show: false }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAnnouncement({ ...newAnnouncement, [name]: value });
    };

    const handleCreateAnnouncement = () => {
        if (!newAnnouncement.title || !newAnnouncement.content) {
            showSnackbar('Please fill title and content', 'error');
            return;
        }

        // Construct target string based on selections
        const target = `${newAnnouncement.targetUser.toUpperCase()} - Class ${newAnnouncement.targetClass}${newAnnouncement.targetSection !== 'All' ? ` (Section ${newAnnouncement.targetSection})` : ''}`;

        const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
        const newAnnouncementWithId = {
            ...newAnnouncement,
            id: newId,
            date: new Date().toISOString().split('T')[0],
            author: 'Admin',
            target: target
        };

        setAnnouncements([newAnnouncementWithId, ...announcements]);
        setNewAnnouncement({
            title: '',
            content: '',
            category: 'General',
            priority: 'medium',
            targetUser: 'parent',
            targetClass: 'Nur',
            targetSection: 'B',
            attachments: []
        });
        setShowForm(false);

        showSnackbar(`Announcement "${newAnnouncement.title}" published successfully!`, 'success');
    };

    const handleDeleteClick = (id, title) => {
        // Show confirmation snackbar first
        showSnackbar(`Confirm deletion of "${title}"? Click delete again within 5 seconds to confirm.`, 'warning');

        // Set delete confirmation state
        setDeleteConfirmation({
            show: true,
            id,
            title
        });

        // Auto-clear confirmation after 5 seconds
        setTimeout(() => {
            setDeleteConfirmation({
                show: false,
                id: null,
                title: ''
            });
        }, 5000);
    };

    const confirmDelete = () => {
        const { id, title } = deleteConfirmation;

        if (id) {
            setAnnouncements(announcements.filter(announcement => announcement.id !== id));
            showSnackbar(`Announcement "${title}" deleted successfully`, 'success');
            setDeleteConfirmation({
                show: false,
                id: null,
                title: ''
            });
        }
    };

    const cancelDelete = () => {
        showSnackbar('Delete operation cancelled', 'info');
        setDeleteConfirmation({
            show: false,
            id: null,
            title: ''
        });
    };

    const handleToggleExpand = (id) => {
        const announcement = announcements.find(a => a.id === id);
        const isExpanding = expandedAnnouncement !== id;
        setExpandedAnnouncement(isExpanding ? id : null);

        showSnackbar(
            isExpanding
                ? `Expanded: "${announcement.title}"`
                : `Collapsed: "${announcement.title}"`,
            'info'
        );
    };

    const handleFilterChange = (filterType, value) => {
        const filterLabels = {
            category: value === 'all' ? 'All Categories' : value,
            priority: value === 'all' ? 'All Priorities' : value.charAt(0).toUpperCase() + value.slice(1) + ' Priority',
            dateRange: value === 'all' ? 'All Time' : value === 'today' ? 'Today' : value === 'week' ? 'This Week' : 'This Month'
        };

        setFilters({ ...filters, [filterType]: value });

        // Show snackbar for filter changes
        showSnackbar(`Filter updated: ${filterLabels[filterType]}`, 'info');
    };

    const handleShareAnnouncement = (title) => {
        // Simulate share action
        showSnackbar(`"${title}" shared successfully! Link copied to clipboard.`, 'success');

        // In a real app, you would copy to clipboard
        // navigator.clipboard.writeText(window.location.href);
    };

    const handlePrintAnnouncement = (title) => {
        // Show confirmation snackbar
        showSnackbar(`Preparing "${title}" for printing...`, 'info');

        // Small delay to show snackbar before print dialog
        setTimeout(() => {
            window.print();
            showSnackbar(`"${title}" sent to printer successfully`, 'success');
        }, 500);
    };

    const handleDownloadAttachment = (fileName, announcementTitle) => {
        // Simulate download action
        showSnackbar(`Downloading "${fileName}" from "${announcementTitle}"...`, 'info');

        // Simulate download completion
        setTimeout(() => {
            showSnackbar(`"${fileName}" downloaded successfully`, 'success');
        }, 1000);
    };

    const handleFormattingButton = (formatType) => {
        const formatMessages = {
            'B': 'Bold formatting applied',
            'I': 'Italic formatting applied',
            'U': 'Underline formatting applied',
            '⊕': 'Symbol insertion mode activated',
            'Ix': 'Subscript mode activated',
            '📎': 'File attachment dialog opened',
            '📷': 'Image insertion dialog opened'
        };

        showSnackbar(formatMessages[formatType], 'info');
    };

    const filteredAnnouncements = announcements.filter(announcement => {
        if (filters.category !== 'all' && announcement.category !== filters.category) return false;
        if (filters.priority !== 'all' && announcement.priority !== filters.priority) return false;

        if (filters.dateRange !== 'all') {
            const announcementDate = new Date(announcement.date);
            const today = new Date();
            const diffDays = Math.floor((today - announcementDate) / (1000 * 60 * 60 * 24));

            if (filters.dateRange === 'today' && diffDays > 0) return false;
            if (filters.dateRange === 'week' && diffDays > 7) return false;
            if (filters.dateRange === 'month' && diffDays > 30) return false;
        }

        return true;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'low': return '#27ae60';
            default: return '#7f8c8d';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Academic': return '📚';
            case 'Holiday': return '🎉';
            case 'Sports': return '⚽';
            case 'Examination': return '📝';
            case 'Event': return '🎪';
            default: return '📢';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Add CSS animation for snackbar
    const globalStyles = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @media print {
            .no-print {
                display: none !important;
            }
        }
        
        .delete-confirmation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1001;
            min-width: 300px;
            text-align: center;
            border: 2px solid #e74c3c;
        }
        
        .confirmation-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        
        .confirmation-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .confirm-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .cancel-btn {
            background: #95a5a6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }
    `;

    return (
        <div style={containerStyle}>
            {/* Add global styles for animations */}
            <style>{globalStyles}</style>

            <h2 style={titleStyle}>📢 View Announcements</h2>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.show && (
                <>
                    <div className="confirmation-overlay"></div>
                    <div className="delete-confirmation">
                        <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>Confirm Delete</h3>
                        <p>Are you sure you want to delete "{deleteConfirmation.title}"?</p>
                        <div className="confirmation-buttons">
                            <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                            <button onClick={confirmDelete} className="confirm-btn">Delete</button>
                        </div>
                        <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '10px' }}>
                            This action cannot be undone.
                        </p>
                    </div>
                </>
            )}

            {/* Header with Create Button */}
            <div style={headerSectionStyle}>
                <div style={headerInfoStyle}>
                    <h3 style={headerTitleStyle}>School Announcements</h3>
                    <p style={headerSubtitleStyle}>
                        Important notices, events and updates for students, parents and staff
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        showSnackbar(
                            showForm
                                ? 'Announcement form closed'
                                : 'Create announcement form opened',
                            'info'
                        );
                    }}
                    style={createButtonStyle}
                >
                    {showForm ? '✕ Close Form' : '➕ Create Announcement'}
                </button>
            </div>

            {/* Create Announcement Form */}
            {showForm && (
                <div style={createFormStyle}>
                    <h3 style={formTitleStyle}>Create Announcement</h3>
                    <div style={formGridStyle}>
                        {/* First Row: User, Class, Section */}
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Select User:</label>
                            <div style={selectWrapperStyle}>
                                <select
                                    name="targetUser"
                                    value={newAnnouncement.targetUser}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        showSnackbar(`Target user set to: ${e.target.value}`, 'info');
                                    }}
                                    style={selectStyle}
                                >
                                    {userTypes.map(user => (
                                        <option key={user} value={user}>
                                            {user.charAt(0).toUpperCase() + user.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <span style={requiredIndicatorStyle}></span>
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Select Class:</label>
                            <div style={selectWrapperStyle}>
                                <select
                                    name="targetClass"
                                    value={newAnnouncement.targetClass}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        showSnackbar(`Target class set to: ${e.target.value}`, 'info');
                                    }}
                                    style={selectStyle}
                                >
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>
                                            {cls}
                                        </option>
                                    ))}
                                </select>
                                <span style={requiredIndicatorStyle}></span>
                            </div>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Select Section:</label>
                            <div style={selectWrapperStyle}>
                                <select
                                    name="targetSection"
                                    value={newAnnouncement.targetSection}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        showSnackbar(`Target section set to: ${e.target.value}`, 'info');
                                    }}
                                    style={selectStyle}
                                >
                                    {sections.map(section => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                                <span style={requiredIndicatorStyle}></span>
                            </div>
                        </div>

                        {/* Second Row: Title */}
                        <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Title*</label>
                            <input
                                type="text"
                                name="title"
                                value={newAnnouncement.title}
                                onChange={handleInputChange}
                                placeholder="Enter title here..."
                                style={inputStyle}
                                onFocus={() => showSnackbar('Enter announcement title', 'info')}
                            />
                        </div>

                        {/* Third Row: Message with formatting toolbar */}
                        <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                            <div style={toolbarStyle}>
                                <label style={labelStyle}>Message*</label>
                                <div style={formattingToolbarStyle}>
                                    <span style={normalTextStyle}>Normal</span>
                                    <span style={toolbarSeparatorStyle}>:</span>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('B');
                                        }}
                                    >
                                        B
                                    </button>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('I');
                                        }}
                                    >
                                        I
                                    </button>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('U');
                                        }}
                                    >
                                        U
                                    </button>
                                    <span style={toolbarSeparatorStyle}>|</span>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('⊕');
                                        }}
                                    >
                                        ⊕
                                    </button>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('Ix');
                                        }}
                                    >
                                        I<sub>x</sub>
                                    </button>
                                    <span style={toolbarSeparatorStyle}>|</span>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('📎');
                                        }}
                                    >
                                        📎
                                    </button>
                                    <button
                                        style={toolbarButtonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFormattingButton('📷');
                                        }}
                                    >
                                        📷
                                    </button>
                                </div>
                            </div>
                            <textarea
                                name="content"
                                value={newAnnouncement.content}
                                onChange={handleInputChange}
                                placeholder="Enter message here..."
                                style={textareaStyle}
                                rows="8"
                                onFocus={() => showSnackbar('Enter announcement message', 'info')}
                            />
                        </div>

                        {/* Fourth Row: Category and Priority */}
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Category</label>
                            <select
                                name="category"
                                value={newAnnouncement.category}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    showSnackbar(`Category set to: ${e.target.value}`, 'info');
                                }}
                                style={selectStyle}
                            >
                                {categories.filter(c => c !== 'All Categories').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Priority</label>
                            <select
                                name="priority"
                                value={newAnnouncement.priority}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    showSnackbar(`Priority set to: ${e.target.value}`, 'info');
                                }}
                                style={selectStyle}
                            >
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>

                        {/* Required fields note */}
                        <div style={{ ...requiredNoteStyle, gridColumn: '1 / -1' }}>
                            <span style={requiredStarStyle}>*</span>
                            <span style={requiredTextStyle}>Please fill in all required fields.</span>
                        </div>

                        {/* Form actions */}
                        <div style={{ ...formActionsStyle, gridColumn: '1 / -1' }}>
                            <button
                                onClick={() => {
                                    if (newAnnouncement.title || newAnnouncement.content) {
                                        showSnackbar('Are you sure you want to cancel? Unsaved changes will be lost.', 'warning');
                                        // In real app, you would have another confirmation here
                                    }
                                    setShowForm(false);
                                    showSnackbar('Announcement creation cancelled', 'info');
                                }}
                                style={cancelButtonStyle}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAnnouncement}
                                style={publishButtonStyle}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={filterContainerStyle}>
                <div style={filterRowStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Category:</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            style={filterSelectStyle}
                        >
                            {categories.map(category => (
                                <option key={category} value={category === 'All Categories' ? 'all' : category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Priority:</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            style={filterSelectStyle}
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Date Range:</label>
                        <select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            style={filterSelectStyle}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    <div style={filterInfoStyle}>
                        {filteredAnnouncements.length} announcements found
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div style={announcementsListStyle}>
                {filteredAnnouncements.map(announcement => (
                    <div key={announcement.id} style={announcementCardStyle}>
                        <div style={cardHeaderStyle}>
                            <div style={headerLeftStyle}>
                                <div style={{
                                    ...priorityBadgeStyle,
                                    backgroundColor: getPriorityColor(announcement.priority)
                                }}>
                                    {getPriorityIcon(announcement.priority)} {announcement.priority.toUpperCase()}
                                </div>
                                <span style={categoryBadgeStyle}>
                                    {getCategoryIcon(announcement.category)} {announcement.category}
                                </span>
                                <span style={targetBadgeStyle}>
                                    👥 {announcement.target}
                                </span>
                            </div>
                            <div style={headerRightStyle}>
                                <span style={dateStyle}>{formatDate(announcement.date)}</span>
                                <span style={authorStyle}>By: {announcement.author}</span>
                            </div>
                        </div>

                        <div style={cardBodyStyle}>
                            <h4 style={announcementTitleStyle}>{announcement.title}</h4>

                            <div style={contentWrapperStyle}>
                                <p style={{
                                    ...contentStyle,
                                    maxHeight: expandedAnnouncement === announcement.id ? 'none' : '100px',
                                    overflow: expandedAnnouncement === announcement.id ? 'visible' : 'hidden'
                                }}>
                                    {announcement.content}
                                </p>

                                {announcement.content.length > 200 && (
                                    <button
                                        onClick={() => handleToggleExpand(announcement.id)}
                                        style={readMoreStyle}
                                    >
                                        {expandedAnnouncement === announcement.id ? 'Read Less' : 'Read More'}
                                    </button>
                                )}
                            </div>

                            {/* Attachments */}
                            {announcement.attachments.length > 0 && (
                                <div style={attachmentsSectionStyle}>
                                    <h5 style={attachmentsTitleStyle}>
                                        📎 Attachments ({announcement.attachments.length})
                                    </h5>
                                    <div style={attachmentsListStyle}>
                                        {announcement.attachments.map((file, index) => (
                                            <div key={index} style={attachmentItemStyle}>
                                                <span style={fileIconStyle}>📄</span>
                                                <span style={fileNameStyle}>{file}</span>
                                                <button
                                                    onClick={() => handleDownloadAttachment(file, announcement.title)}
                                                    style={downloadAttachmentStyle}
                                                >
                                                    ⬇️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={cardFooterStyle} className="no-print">
                            <div style={footerActionsStyle}>
                                <button
                                    onClick={() => handleShareAnnouncement(announcement.title)}
                                    style={shareButtonStyle}
                                >
                                    🔗 Share
                                </button>
                                <button
                                    onClick={() => handlePrintAnnouncement(announcement.title)}
                                    style={printButtonStyle}
                                >
                                    🖨️ Print
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(announcement.id, announcement.title)}
                                    style={deleteButtonStyle}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Summary */}
            <div style={statsContainerStyle} className="no-print">
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Total Announcements</h4>
                    <p style={statNumberStyle}>{announcements.length}</p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>High Priority</h4>
                    <p style={{ ...statNumberStyle, color: '#e74c3c' }}>
                        {announcements.filter(a => a.priority === 'high').length}
                    </p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>This Month</h4>
                    <p style={{ ...statNumberStyle, color: '#3498db' }}>
                        {announcements.filter(a => {
                            const announcementDate = new Date(a.date);
                            const today = new Date();
                            const diffDays = Math.floor((today - announcementDate) / (1000 * 60 * 60 * 24));
                            return diffDays <= 30;
                        }).length}
                    </p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Most Active Category</h4>
                    <p style={{ ...statNumberStyle, color: '#9b59b6' }}>
                        {(() => {
                            const categoryCounts = {};
                            announcements.forEach(a => {
                                categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
                            });
                            const mostCommon = Object.entries(categoryCounts)
                                .sort((a, b) => b[1] - a[1])[0];
                            return mostCommon ? mostCommon[0] : 'N/A';
                        })()}
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {filteredAnnouncements.length === 0 && (
                <div style={emptyStateStyle}>
                    <div style={emptyIconStyle}>📢</div>
                    <h3>No Announcements Found</h3>
                    <p>Create a new announcement or try different filters</p>
                </div>
            )}

            {/* Snackbar Notification */}
            {snackbar.show && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={closeSnackbar}
                />
            )}
        </div>
    );
};

// All style objects remain exactly the same as before
const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    minHeight: '100vh'
};

const titleStyle = {
    color: '#2c3e50',
    marginBottom: '25px',
    borderBottom: '2px solid #4a6ee0',
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const headerSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '20px'
};

const headerInfoStyle = {
    flex: '2',
    minWidth: '300px'
};

const headerTitleStyle = {
    color: '#2c3e50',
    marginBottom: '8px',
    fontSize: '20px'
};

const headerSubtitleStyle = {
    color: '#7f8c8d',
    fontSize: '14px',
    lineHeight: '1.5'
};

const createButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap'
};

const createFormStyle = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '25px',
    border: '2px solid #e1e8ed',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
};

const formTitleStyle = {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: '600',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
};

const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '5px'
};

const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white'
};

const selectStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white',
    width: '100%'
};

const selectWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
};

const requiredIndicatorStyle = {
    position: 'absolute',
    right: '10px',
    color: '#e74c3c',
    fontSize: '14px',
    fontWeight: 'bold'
};

const toolbarStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px'
};

const formattingToolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e1e8ed'
};

const normalTextStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
};

const toolbarSeparatorStyle = {
    color: '#bdc3c7',
    fontSize: '14px'
};

const toolbarButtonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: '28px',
    textAlign: 'center',
    ':hover': {
        backgroundColor: '#e1e8ed'
    }
};

const textareaStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white',
    resize: 'vertical',
    minHeight: '150px',
    fontFamily: 'inherit',
    width: '100%'
};

const requiredNoteStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px',
    backgroundColor: '#fff9e6',
    borderRadius: '6px',
    borderLeft: '3px solid #f39c12',
    marginTop: '10px'
};

const requiredStarStyle = {
    color: '#e74c3c',
    fontSize: '16px',
    fontWeight: 'bold'
};

const requiredTextStyle = {
    fontSize: '14px',
    color: '#7f8c8d'
};

const formActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
};

const cancelButtonStyle = {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '100px'
};

const publishButtonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '100px'
};

const filterContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px'
};

const filterRowStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
};

const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
    minWidth: '180px'
};

const filterLabelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
};

const filterSelectStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white'
};

const filterInfoStyle = {
    marginLeft: 'auto',
    fontSize: '14px',
    color: '#7f8c8d',
    alignSelf: 'center'
};

const announcementsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px'
};

const announcementCardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    }
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e1e8ed',
    flexWrap: 'wrap',
    gap: '15px'
};

const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
};

const priorityBadgeStyle = {
    color: 'white',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px'
};

const categoryBadgeStyle = {
    backgroundColor: '#e8f4fc',
    color: '#3498db',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px'
};

const targetBadgeStyle = {
    backgroundColor: '#e8f6f3',
    color: '#27ae60',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px'
};

const headerRightStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px'
};

const dateStyle = {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: '600'
};

const authorStyle = {
    fontSize: '12px',
    color: '#7f8c8d'
};

const cardBodyStyle = {
    padding: '20px'
};

const announcementTitleStyle = {
    color: '#2c3e50',
    margin: '0 0 15px 0',
    fontSize: '18px',
    lineHeight: '1.4'
};

const contentWrapperStyle = {
    marginBottom: '20px'
};

const contentStyle = {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#5d6d7e',
    lineHeight: '1.6',
    transition: 'max-height 0.3s ease'
};

const readMoreStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4a6ee0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: '5px 0',
    ':hover': {
        textDecoration: 'underline'
    }
};

const attachmentsSectionStyle = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
};

const attachmentsTitleStyle = {
    margin: '0 0 10px 0',
    color: '#2c3e50',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const attachmentsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const attachmentItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e1e8ed'
};

const fileIconStyle = {
    fontSize: '16px'
};

const fileNameStyle = {
    flex: '1',
    fontSize: '14px',
    color: '#2c3e50'
};

const downloadAttachmentStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4a6ee0',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '5px',
    borderRadius: '4px',
    ':hover': {
        backgroundColor: '#f0f0f0'
    }
};

const cardFooterStyle = {
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e1e8ed'
};

const footerActionsStyle = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
};

const shareButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
};

const printButtonStyle = {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
};

const deleteButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
};

const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginTop: '30px'
};

const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
};

const statTitleStyle = {
    margin: '0 0 10px 0',
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: '600'
};

const statNumberStyle = {
    margin: '0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4a6ee0'
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '50px 20px',
    color: '#7f8c8d'
};

const emptyIconStyle = {
    fontSize: '60px',
    marginBottom: '20px'
};

export default ViewAnnouncements;