// Chat.js - Complete Live Chat Component (Final Fixed Version)
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Snackbar, Alert, IconButton, Tooltip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    Image as ImageIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    Videocam as VideocamIcon,
    Phone as PhoneIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    ClearAll as ClearAllIcon,
    FileDownload as FileDownloadIcon,
    Settings as SettingsIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';

const Chat = () => {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [fullScreenMode, setFullScreenMode] = useState(false);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const menuOpen = Boolean(menuAnchorEl);

    // State management
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Sample data - users and initial messages (using useMemo to prevent re-renders)
    const users = useMemo(() => [
        { id: 1, name: 'Rahul Sharma', role: 'Student - Class 10A', avatar: '👨‍🎓', online: true, unread: 2 },
        { id: 2, name: 'Priya Patel', role: 'Student - Class 9B', avatar: '👩‍🎓', online: true, unread: 0 },
        { id: 3, name: 'Amit Kumar', role: 'Student - Class 11C', avatar: '👨‍🎓', online: false, unread: 5 },
        { id: 4, name: 'Neha Gupta', role: 'Parent', avatar: '👩', online: true, unread: 0 },
        { id: 5, name: 'Principal Office', role: 'Administration', avatar: '🏛️', online: true, unread: 1 },
        { id: 6, name: 'Mr. Verma', role: 'Physics Teacher', avatar: '👨‍🏫', online: false, unread: 0 },
        { id: 7, name: 'Mrs. Desai', role: 'Chemistry Teacher', avatar: '👩‍🏫', online: true, unread: 0 },
        { id: 8, name: 'Class 10A Group', role: 'Group Chat', avatar: '👥', online: true, unread: 3 }
    ], []);

    // Initial messages
    const initialMessages = useMemo(() => [
        { id: 1, userId: 1, text: 'Good morning sir, I have a doubt in today\'s math assignment.', time: '09:15 AM', type: 'received' },
        { id: 2, userId: 0, text: 'Good morning Rahul! Which problem are you facing?', time: '09:16 AM', type: 'sent' },
        { id: 3, userId: 1, text: 'Problem number 5 from exercise 3.2', time: '09:17 AM', type: 'received' },
        { id: 4, userId: 0, text: 'Let me check and I\'ll send you the solution in 10 minutes.', time: '09:18 AM', type: 'sent' },
        { id: 5, userId: 1, text: 'Thank you sir!', time: '09:19 AM', type: 'received' },
        { id: 6, userId: 8, text: 'Reminder: Science project submission is tomorrow', time: '08:30 AM', type: 'received', group: true },
        { id: 7, userId: 8, text: 'Please complete your assignments on time', time: '08:31 AM', type: 'received', group: true }
    ], []);

    // Show snackbar notification
    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    }, []);

    // Close snackbar
    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // Format file size function
    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    // Initialize component
    useEffect(() => {
        // Set initial data
        setMessages(initialMessages);
        setOnlineUsers(users.filter(user => user.online));

        // Auto-select first user
        if (!selectedUser && users.length > 0) {
            setSelectedUser(users[0]);
        }

        // Simulate typing indicator for first user
        const typingInterval = setInterval(() => {
            if (selectedUser?.id === 1) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
            }
        }, 15000);

        return () => clearInterval(typingInterval);
    }, [initialMessages, users, selectedUser]);

    // Filter users based on search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Send message
    const handleSendMessage = useCallback(() => {
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: messages.length + 1,
            userId: 0,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'sent'
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        // Show success snackbar
        showSnackbar('Message sent successfully!', 'success');

        // Simulate reply after 2 seconds
        if (selectedUser) {
            setTimeout(() => {
                const replyMsg = {
                    id: messages.length + 2,
                    userId: selectedUser.id,
                    text: `Thank you for your message! This is an auto-reply from ${selectedUser.name}.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'received'
                };
                setMessages(prev => [...prev, replyMsg]);
                showSnackbar(`New message from ${selectedUser.name}`, 'info');
            }, 2000);
        }
    }, [newMessage, messages, selectedUser, showSnackbar]);

    // Handle file upload
    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showSnackbar('File size too large! Maximum 10MB allowed.', 'error');
                return;
            }

            const newMsg = {
                id: messages.length + 1,
                userId: 0,
                text: `📎 Attached file: ${file.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'sent',
                attachment: {
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type
                }
            };

            setMessages([...messages, newMsg]);
            showSnackbar(`File "${file.name}" sent successfully!`, 'success');
        }
    }, [messages, showSnackbar, formatFileSize]);

    // Handle image upload
    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showSnackbar('Please select an image file!', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showSnackbar('Image size too large! Maximum 5MB allowed.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const newMsg = {
                    id: messages.length + 1,
                    userId: 0,
                    text: '📷 Image sent',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'sent',
                    image: event.target.result
                };

                setMessages([...messages, newMsg]);
                showSnackbar('Image sent successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }, [messages, showSnackbar]);

    // Delete message
    const handleDeleteMessage = useCallback((messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            setMessages(messages.filter(msg => msg.id !== messageId));
            showSnackbar('Message deleted successfully!', 'info');
        }
    }, [messages, showSnackbar]);

    // Start video call
    const handleVideoCall = useCallback(() => {
        showSnackbar('Initiating video call...', 'info');
        // In real app, this would connect to video call service
        setTimeout(() => {
            showSnackbar('Video call started!', 'success');
        }, 1000);
    }, [showSnackbar]);

    // Start voice call
    const handleVoiceCall = useCallback(() => {
        showSnackbar('Initiating voice call...', 'info');
        // In real app, this would connect to voice call service
        setTimeout(() => {
            showSnackbar('Voice call started!', 'success');
        }, 1000);
    }, [showSnackbar]);

    // Clear chat
    const handleClearChat = useCallback(() => {
        setClearDialogOpen(true);
    }, []);

    const handleConfirmClearChat = useCallback(() => {
        setMessages([]);
        setClearDialogOpen(false);
        showSnackbar('Chat cleared successfully!', 'info');
    }, [showSnackbar]);

    const handleCancelClearChat = useCallback(() => {
        setClearDialogOpen(false);
    }, []);

    // Export chat
    const handleExportChat = useCallback(() => {
        const chatContent = messages.map(msg => {
            const user = msg.type === 'sent' ? 'You' : users.find(u => u.id === msg.userId)?.name || 'Unknown';
            return `${msg.time} - ${user}: ${msg.text}`;
        }).join('\n');

        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${selectedUser?.name || 'export'}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showSnackbar('Chat exported successfully!', 'success');
    }, [messages, selectedUser, users, showSnackbar]);

    // Toggle full screen mode
    const toggleFullScreenMode = useCallback(() => {
        setFullScreenMode(!fullScreenMode);
        showSnackbar(
            fullScreenMode ? 'Exited full-screen mode' : 'Entered full-screen mode',
            'info'
        );
    }, [fullScreenMode, showSnackbar]);

    // Handle key press (Enter to send)
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    // Handle user selection
    const handleUserSelect = useCallback((user) => {
        setSelectedUser(user);
        // Mark messages as read
        setMessages(messages.map(msg =>
            msg.userId === user.id ? { ...msg, read: true } : msg
        ));
    }, [messages]);

    // Menu handlers
    const handleMenuOpen = useCallback((event) => {
        setMenuAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    // ================= STYLES =================
    const containerStyle = {
        display: 'flex',
        height: fullScreenMode ? 'calc(100vh - 40px)' : 'calc(100vh - 180px)',
        backgroundColor: 'white',
        borderRadius: fullScreenMode ? '0' : '16px',
        boxShadow: fullScreenMode ? 'none' : '0 8px 30px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        position: 'relative'
    };

    const sidebarStyle = {
        width: fullScreenMode ? '0' : '320px',
        borderRight: fullScreenMode ? 'none' : '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: fullScreenMode ? 'hidden' : 'visible'
    };

    const chatHeaderStyle = {
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        display: fullScreenMode ? 'none' : 'block'
    };

    const chatTitleStyle = {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1f36',
        marginBottom: '5px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const chatSubtitleStyle = {
        fontSize: '14px',
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const searchContainerStyle = {
        padding: '15px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: fullScreenMode ? 'none' : 'block'
    };

    const searchInputStyle = {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '10px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        backgroundColor: 'white',
        outline: 'none',
        '&:focus': {
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
        }
    };

    const usersListStyle = {
        flex: 1,
        overflowY: 'auto',
        padding: '10px 0',
        display: fullScreenMode ? 'none' : 'block'
    };

    const userItemStyle = (isSelected) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
        borderLeft: isSelected ? '4px solid #667eea' : '4px solid transparent',
        '&:hover': {
            backgroundColor: '#f3f4f6'
        }
    });

    const avatarStyle = (isOnline) => ({
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: isOnline ? '#dcfce7' : '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        marginRight: '15px',
        border: isOnline ? '2px solid #10b981' : '2px solid #d1d5db'
    });

    const userInfoStyle = {
        flex: 1
    };

    const userNameStyle = {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a1f36',
        marginBottom: '3px'
    };

    const userRoleStyle = {
        fontSize: '12px',
        color: '#6b7280'
    };

    const unreadBadgeStyle = {
        backgroundColor: '#ef4444',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const onlineIndicatorStyle = {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        marginRight: '5px'
    };

    const chatAreaStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: fullScreenMode ? '100%' : 'calc(100% - 320px)',
        transition: 'width 0.3s ease'
    };

    const chatHeaderAreaStyle = {
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const selectedUserInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    };

    const selectedUserNameStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1f36'
    };

    const selectedUserStatusStyle = {
        fontSize: '13px',
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    };

    const actionButtonsStyle = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    };

    const messagesContainerStyle = {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    };

    const messageBubbleStyle = (type) => ({
        maxWidth: '70%',
        padding: '12px 16px',
        borderRadius: '18px',
        position: 'relative',
        alignSelf: type === 'sent' ? 'flex-end' : 'flex-start',
        backgroundColor: type === 'sent' ? '#667eea' : 'white',
        color: type === 'sent' ? 'white' : '#1a1f36',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: type === 'received' ? '1px solid #e5e7eb' : 'none'
    });

    const groupMessageStyle = {
        backgroundColor: '#fef3c7',
        border: '1px solid #fbbf24',
        color: '#92400e'
    };

    const messageTextStyle = {
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '5px',
        wordBreak: 'break-word'
    };

    const messageTimeStyle = {
        fontSize: '11px',
        color: '#9ca3af',
        textAlign: 'right',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '5px'
    };

    const attachmentStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '8px',
        border: '1px dashed rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const imageMessageStyle = {
        maxWidth: '200px',
        borderRadius: '10px',
        marginTop: '8px',
        border: '1px solid rgba(0, 0, 0, 0.1)'
    };

    const deleteButtonStyle = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: 0,
        transition: 'opacity 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }
    };

    const messageBubbleHoverStyle = {
        '&:hover button': {
            opacity: 1
        }
    };

    const typingIndicatorStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '10px 20px',
        backgroundColor: 'white',
        borderRadius: '18px',
        alignSelf: 'flex-start',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        width: 'fit-content'
    };

    const typingDotsStyle = {
        display: 'flex',
        gap: '3px'
    };

    const typingDotStyle = {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#6b7280',
        animation: 'typing 1.4s infinite ease-in-out'
    };

    const inputContainerStyle = {
        padding: '20px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    };

    const inputStyle = {
        flex: 1,
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid #d1d5db',
        fontSize: '15px',
        resize: 'none',
        maxHeight: '120px',
        outline: 'none',
        '&:focus': {
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
        }
    };

    const sendButtonStyle = {
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#764ba2',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        },
        '&:disabled': {
            backgroundColor: '#9ca3af',
            cursor: 'not-allowed'
        }
    };

    const iconButtonStyle = {
        color: '#6b7280',
        transition: 'all 0.2s',
        '&:hover': {
            color: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)'
        }
    };

    const onlineStatusStyle = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#10b981',
        fontWeight: '600',
        gap: '5px'
    };

    const menuIconStyle = {
        marginRight: '8px',
        fontSize: '18px'
    };

    const fullScreenToggleStyle = {
        position: 'absolute',
        top: '15px',
        left: fullScreenMode ? '15px' : '340px',
        zIndex: 100,
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'left 0.3s ease'
    };

    const typingAnimationStyle = `
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        .message-bubble:hover .delete-btn {
            opacity: 1 !important;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    `;

    return (
        <div style={{
            padding: fullScreenMode ? '0' : '20px',
            height: fullScreenMode ? '100vh' : 'auto',
            backgroundColor: fullScreenMode ? 'white' : 'transparent'
        }}>
            <style>{typingAnimationStyle}</style>

            {/* Full Screen Toggle Button */}
            <div style={fullScreenToggleStyle} onClick={toggleFullScreenMode}>
                {fullScreenMode ? (
                    <FullscreenExitIcon style={{ color: '#667eea' }} />
                ) : (
                    <FullscreenIcon style={{ color: '#667eea' }} />
                )}
            </div>

            <div style={containerStyle}>
                {/* Left Sidebar - Users List */}
                <div style={sidebarStyle}>
                    <div style={chatHeaderStyle}>
                        <h2 style={chatTitleStyle}>Chat Messages</h2>
                        <p style={chatSubtitleStyle}>
                            <span style={onlineStatusStyle}>
                                <div style={onlineIndicatorStyle}></div>
                                {onlineUsers.length} online
                            </span>
                            • Total: {users.length} contacts
                        </p>
                    </div>

                    <div style={searchContainerStyle}>
                        <div style={{ position: 'relative' }}>
                            <SearchIcon style={{
                                position: 'absolute',
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af'
                            }} />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                style={{ ...searchInputStyle, paddingLeft: '45px' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={usersListStyle}>
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                style={userItemStyle(selectedUser?.id === user.id)}
                                onClick={() => handleUserSelect(user)}
                                className="user-item"
                            >
                                <div style={avatarStyle(user.online)}>
                                    {user.avatar}
                                </div>
                                <div style={userInfoStyle}>
                                    <div style={userNameStyle}>{user.name}</div>
                                    <div style={userRoleStyle}>{user.role}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                        {user.online ? (
                                            <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                ● Online
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                                                Last seen 2h ago
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {user.unread > 0 && (
                                    <div style={unreadBadgeStyle}>
                                        {user.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Area - Chat */}
                <div style={chatAreaStyle}>
                    {/* Chat Header */}
                    {selectedUser && (
                        <div style={chatHeaderAreaStyle}>
                            <div style={selectedUserInfoStyle}>
                                <div style={avatarStyle(selectedUser.online)}>
                                    {selectedUser.avatar}
                                </div>
                                <div>
                                    <div style={selectedUserNameStyle}>{selectedUser.name}</div>
                                    <div style={selectedUserStatusStyle}>
                                        {selectedUser.online ? (
                                            <>
                                                <div style={onlineIndicatorStyle}></div>
                                                Online • Active now
                                            </>
                                        ) : (
                                            <>
                                                <ScheduleIcon style={{ fontSize: '14px' }} />
                                                Offline • Last seen today at 10:30 AM
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={actionButtonsStyle}>
                                <Tooltip title="Voice Call">
                                    <IconButton style={iconButtonStyle} onClick={handleVoiceCall}>
                                        <PhoneIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Video Call">
                                    <IconButton style={iconButtonStyle} onClick={handleVideoCall}>
                                        <VideocamIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="More Options">
                                    <IconButton
                                        style={iconButtonStyle}
                                        onClick={handleMenuOpen}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    )}

                    {/* Messages Container */}
                    <div style={messagesContainerStyle}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    ...messageBubbleStyle(message.type),
                                    ...(message.group ? groupMessageStyle : {}),
                                    ...messageBubbleHoverStyle
                                }}
                                className="message-bubble"
                            >
                                {message.group && (
                                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px', color: '#92400e' }}>
                                        Group: {users.find(u => u.id === message.userId)?.name || 'Unknown'}
                                    </div>
                                )}
                                <div style={messageTextStyle}>{message.text}</div>

                                {message.attachment && (
                                    <div style={attachmentStyle}>
                                        <AttachFileIcon style={{ fontSize: '16px' }} />
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '600' }}>{message.attachment.name}</div>
                                            <div style={{ fontSize: '11px', opacity: 0.8 }}>{message.attachment.size} • {message.attachment.type}</div>
                                        </div>
                                    </div>
                                )}

                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Sent"
                                        style={imageMessageStyle}
                                        onClick={() => window.open(message.image, '_blank')}
                                    />
                                )}

                                <div style={messageTimeStyle}>
                                    {message.time}
                                    {message.type === 'sent' && (
                                        <CheckCircleIcon style={{ fontSize: '14px', color: message.read ? '#10b981' : '#9ca3af' }} />
                                    )}
                                </div>

                                {message.type === 'sent' && (
                                    <button
                                        style={deleteButtonStyle}
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="delete-btn"
                                        title="Delete message"
                                    >
                                        <DeleteIcon style={{ fontSize: '14px' }} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {isTyping && selectedUser?.id === 1 && (
                            <div style={typingIndicatorStyle}>
                                <div style={avatarStyle(true)}>
                                    {selectedUser.avatar}
                                </div>
                                <div style={typingDotsStyle}>
                                    <div style={{ ...typingDotStyle, animationDelay: '-0.32s' }} className="typing-dot"></div>
                                    <div style={{ ...typingDotStyle, animationDelay: '-0.16s' }} className="typing-dot"></div>
                                    <div style={typingDotStyle} className="typing-dot"></div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={inputContainerStyle}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Tooltip title="Attach File">
                                <IconButton
                                    style={iconButtonStyle}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <AttachFileIcon />
                                </IconButton>
                            </Tooltip>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                            />

                            <Tooltip title="Send Image">
                                <IconButton
                                    style={iconButtonStyle}
                                    onClick={() => imageInputRef.current.click()}
                                >
                                    <ImageIcon />
                                </IconButton>
                            </Tooltip>
                            <input
                                type="file"
                                ref={imageInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept="image/*"
                            />

                            <Tooltip title="Emoji">
                                <IconButton style={iconButtonStyle}>
                                    <EmojiEmotionsIcon />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <textarea
                            style={inputStyle}
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows="1"
                        />

                        <button
                            style={sendButtonStyle}
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <SendIcon />
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Clear Chat Confirmation Dialog */}
            <Dialog
                open={clearDialogOpen}
                onClose={handleCancelClearChat}
                PaperProps={{
                    style: {
                        borderRadius: '16px',
                        padding: '10px'
                    }
                }}
            >
                <DialogTitle style={{ fontSize: '18px', fontWeight: '600', color: '#1a1f36', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ClearAllIcon style={{ color: '#ef4444' }} />
                    Clear Chat
                </DialogTitle>
                <DialogContent>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Are you sure you want to clear all messages in this chat?
                        <br />
                        <strong style={{ color: '#1a1f36' }}>This action cannot be undone.</strong>
                    </p>
                </DialogContent>
                <DialogActions style={{ padding: '20px' }}>
                    <Button
                        onClick={handleCancelClearChat}
                        style={{
                            color: '#6b7280',
                            fontWeight: '600',
                            padding: '8px 20px',
                            borderRadius: '8px'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmClearChat}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontWeight: '600',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#dc2626'
                            }
                        }}
                        variant="contained"
                    >
                        Clear Chat
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Menu for Chat Options */}
            <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        width: '200px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        padding: '8px 0'
                    }
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleClearChat();
                        handleMenuClose();
                    }}
                    style={{ padding: '10px 16px', fontSize: '14px' }}
                >
                    <ClearAllIcon style={menuIconStyle} />
                    Clear Chat
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleExportChat();
                        handleMenuClose();
                    }}
                    style={{ padding: '10px 16px', fontSize: '14px' }}
                >
                    <FileDownloadIcon style={menuIconStyle} />
                    Export Chat
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        showSnackbar('Search messages feature coming soon!', 'info');
                        handleMenuClose();
                    }}
                    style={{ padding: '10px 16px', fontSize: '14px' }}
                >
                    <SearchIcon style={menuIconStyle} />
                    Search Messages
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        showSnackbar('Chat settings feature coming soon!', 'info');
                        handleMenuClose();
                    }}
                    style={{ padding: '10px 16px', fontSize: '14px' }}
                >
                    <SettingsIcon style={menuIconStyle} />
                    Chat Settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        toggleFullScreenMode();
                        handleMenuClose();
                    }}
                    style={{ padding: '10px 16px', fontSize: '14px' }}
                >
                    {fullScreenMode ? (
                        <>
                            <FullscreenExitIcon style={menuIconStyle} />
                            Exit Full Screen
                        </>
                    ) : (
                        <>
                            <FullscreenIcon style={menuIconStyle} />
                            Full Screen Mode
                        </>
                    )}
                </MenuItem>
            </Menu>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Chat;