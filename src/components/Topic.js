import React, { useState, useEffect, useRef } from 'react';

const Topic = () => {
    const [topics, setTopics] = useState([
        { id: 1, className: 'Class 10', topicName: 'Trigonometry Basics', subjectName: 'Mathematics', lessonName: 'Advanced Mathematics', videoLink: 'https://youtube.com/watch?v=abc123' },
        { id: 2, className: 'Class 12', topicName: 'Organic Chemistry', subjectName: 'Chemistry', lessonName: 'Chemistry Fundamentals', videoLink: 'https://youtube.com/watch?v=xyz789' },
        { id: 3, className: 'Class 11', topicName: 'Newton\'s Laws', subjectName: 'Physics', lessonName: 'Physics Introduction', videoLink: 'https://youtube.com/watch?v=def456' }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newTopic, setNewTopic] = useState({
        className: '',
        subjectName: '',
        lessonName: '',
        videoLink: '',
        topicHeading: '',
        topicContent: '',
        file: null
    });

    const [editingTopic, setEditingTopic] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormattingToolbar, setShowFormattingToolbar] = useState(true);
    const [showHyperlinkModal, setShowHyperlinkModal] = useState(false);
    const [hyperlinkUrl, setHyperlinkUrl] = useState('');
    const [hyperlinkText, setHyperlinkText] = useState('');
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, topicId: null, topicName: '' });

    const textareaRef = useRef(null);

    // Mock data
    const classes = ['LKG', 'UKG', 'Nur', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
    const lessons = ['English Poems', 'Addition', 'English Poem', 'Basic Mathematics', 'Science Introduction', 'Advanced Mathematics', 'Chemistry Fundamentals', 'Physics Introduction'];

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => {
            setSnackbar({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTopic(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setNewTopic(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleSaveTopic = () => {
        if (!newTopic.className || !newTopic.topicHeading || !newTopic.topicContent) {
            showSnackbar('Please fill all required fields', 'error');
            return;
        }

        if (editingTopic) {
            // Update existing topic
            setTopics(topics.map(topic =>
                topic.id === editingTopic.id
                    ? {
                        ...topic,
                        className: newTopic.className,
                        subjectName: newTopic.subjectName,
                        lessonName: newTopic.lessonName,
                        topicName: newTopic.topicHeading,
                        videoLink: newTopic.videoLink,
                        content: newTopic.topicContent,
                        fileName: newTopic.file ? newTopic.file.name : topic.fileName
                    }
                    : topic
            ));
            showSnackbar('Topic updated successfully!');
            setEditingTopic(null);
        } else {
            // Add new topic
            const newTopicObj = {
                id: topics.length + 1,
                className: newTopic.className,
                topicName: newTopic.topicHeading,
                subjectName: newTopic.subjectName || 'Not specified',
                lessonName: newTopic.lessonName || 'Not specified',
                videoLink: newTopic.videoLink || 'No link',
                content: newTopic.topicContent,
                fileName: newTopic.file ? newTopic.file.name : null
            };

            setTopics([...topics, newTopicObj]);
            showSnackbar('Topic saved successfully!');
        }

        setNewTopic({
            className: '',
            subjectName: '',
            lessonName: '',
            videoLink: '',
            topicHeading: '',
            topicContent: '',
            file: null
        });
        setShowAddForm(false);
    };

    const handleEditTopic = (topic) => {
        setNewTopic({
            className: topic.className,
            subjectName: topic.subjectName,
            lessonName: topic.lessonName,
            videoLink: topic.videoLink,
            topicHeading: topic.topicName,
            topicContent: topic.content || '',
            file: null
        });
        setEditingTopic(topic);
        setShowAddForm(true);
    };

    const showDeleteConfirmation = (topicId, topicName) => {
        setShowDeleteConfirm({ show: true, topicId, topicName });
    };

    const handleDeleteTopic = () => {
        const { topicId } = showDeleteConfirm;
        setTopics(topics.filter(topic => topic.id !== topicId));
        showSnackbar('Topic deleted successfully!');
        setShowDeleteConfirm({ show: false, topicId: null, topicName: '' });
    };

    const cancelDelete = () => {
        setShowDeleteConfirm({ show: false, topicId: null, topicName: '' });
        showSnackbar('Deletion cancelled', 'info');
    };

    // Function to get text selection from textarea
    const getSelectedText = () => {
        const textarea = textareaRef.current;
        if (!textarea) return { text: '', start: 0, end: 0 };

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value.substring(start, end);

        return { text, start, end };
    };

    // Function to insert text at cursor position
    const insertTextAtCursor = (textToInsert) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { start, end } = getSelectedText();
        const value = textarea.value;

        const newValue = value.substring(0, start) + textToInsert + value.substring(end);
        setNewTopic(prev => ({ ...prev, topicContent: newValue }));

        // Set cursor position after inserted text
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + textToInsert.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 10);
    };

    // Function to wrap selected text
    const wrapSelectedText = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { text, start, end } = getSelectedText();

        if (text) {
            // Wrap selected text
            const wrappedText = before + text + after;
            insertTextAtCursor(wrappedText);
        } else {
            // Insert placeholder with cursor in middle
            const beforeLength = before.length;
            const fullText = before + 'text' + after;

            const value = textarea.value;
            const newValue = value.substring(0, start) + fullText + value.substring(end);
            setNewTopic(prev => ({ ...prev, topicContent: newValue }));

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + beforeLength, start + beforeLength + 4);
            }, 10);
        }
    };

    const applyFormat = (format) => {
        switch (format) {
            case 'bold':
                wrapSelectedText('**', '**');
                showSnackbar('Bold formatting applied');
                break;
            case 'italic':
                wrapSelectedText('*', '*');
                showSnackbar('Italic formatting applied');
                break;
            case 'underline':
                wrapSelectedText('<u>', '</u>');
                showSnackbar('Underline formatting applied');
                break;
            case 'superscript':
                wrapSelectedText('<sup>', '</sup>');
                showSnackbar('Superscript formatting applied');
                break;
            case 'subscript':
                wrapSelectedText('<sub>', '</sub>');
                showSnackbar('Subscript formatting applied');
                break;
            case 'heading1':
                wrapSelectedText('# ', '');
                showSnackbar('Heading 1 formatting applied');
                break;
            case 'heading2':
                wrapSelectedText('## ', '');
                showSnackbar('Heading 2 formatting applied');
                break;
            case 'heading3':
                wrapSelectedText('### ', '');
                showSnackbar('Heading 3 formatting applied');
                break;
            case 'normal':
                const { text, start, end } = getSelectedText();
                if (text) {
                    // Remove formatting from selected text
                    const cleanedText = text
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\*(.*?)\*/g, '$1')
                        .replace(/<u>(.*?)<\/u>/g, '$1')
                        .replace(/<sup>(.*?)<\/sup>/g, '$1')
                        .replace(/<sub>(.*?)<\/sub>/g, '$1')
                        .replace(/^#+\s*/gm, '');

                    const textarea = textareaRef.current;
                    const value = textarea.value;
                    const newValue = value.substring(0, start) + cleanedText + value.substring(end);
                    setNewTopic(prev => ({ ...prev, topicContent: newValue }));
                    showSnackbar('Normal formatting applied');
                }
                break;
            case 'numberedList':
                insertTextAtCursor('1. First item\n2. Second item\n3. Third item');
                showSnackbar('Numbered list inserted');
                break;
            default:
                break;
        }
    };

    const handleAddHyperlink = () => {
        if (!hyperlinkUrl) {
            showSnackbar('Please enter a URL', 'error');
            return;
        }

        // Removed unused 'text' variable that was causing warning
        wrapSelectedText('[', `](${hyperlinkUrl})`);

        setHyperlinkUrl('');
        setHyperlinkText('');
        setShowHyperlinkModal(false);
        showSnackbar('Hyperlink added successfully!');
    };

    const filteredTopics = topics.filter(topic =>
        topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const styles = {
        container: {
            padding: '30px',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1f36',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '14px',
            color: '#6b7280'
        },
        searchContainer: {
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginBottom: '30px'
        },
        searchInput: {
            flex: '1',
            padding: '12px 20px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            outline: 'none',
            '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
            }
        },
        addButton: {
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: '#764ba2',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            marginBottom: '30px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            backgroundColor: '#f3f4f6',
            borderBottom: '1px solid #e5e7eb'
        },
        th: {
            padding: '16px 20px',
            textAlign: 'left',
            fontWeight: '600',
            color: '#374151',
            fontSize: '14px'
        },
        td: {
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#4b5563'
        },
        actionButtons: {
            display: 'flex',
            gap: '10px'
        },
        editButton: {
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#059669',
                transform: 'translateY(-1px)'
            }
        },
        deleteButton: {
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#DC2626',
                transform: 'translateY(-1px)'
            }
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '600px',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        },
        modalHeader: {
            marginBottom: '25px',
            textAlign: 'center'
        },
        modalTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1f36',
            marginBottom: '8px'
        },
        formRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '20px'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '14px'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
            }
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
            }
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            minHeight: '150px',
            resize: 'vertical',
            outline: 'none',
            fontFamily: "'Inter', monospace",
            '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
            }
        },
        fileInput: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px dashed #d1d5db',
            backgroundColor: '#f9fafb',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
                borderColor: '#667eea',
                backgroundColor: '#f3f4f6'
            }
        },
        buttonGroup: {
            display: 'flex',
            gap: '15px',
            marginTop: '30px',
            paddingTop: '15px',
            borderTop: '1px solid #e5e7eb'
        },
        saveButton: {
            flex: '1',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: '#764ba2'
            }
        },
        cancelButton: {
            flex: '1',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: '#4b5563'
            }
        },
        formattingToolbar: {
            backgroundColor: '#f3f4f6',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
            border: '1px solid #d1d5db'
        },
        toolbarTitle: {
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '8px',
            fontWeight: '600'
        },
        toolbarButtons: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
        },
        formatButton: {
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#f9fafb',
                borderColor: '#667eea',
                transform: 'translateY(-1px)'
            }
        },
        normalButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '10px',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#388E3C',
                transform: 'translateY(-1px)'
            }
        },
        hyperlinkModal: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            width: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        },
        hyperlinkForm: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        hyperlinkButtonGroup: {
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
        },
        snackbar: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s ease-out'
        },
        snackbarSuccess: {
            backgroundColor: '#10B981'
        },
        snackbarError: {
            backgroundColor: '#EF4444'
        },
        snackbarInfo: {
            backgroundColor: '#3B82F6'
        },
        snackbarIcon: {
            fontSize: '18px'
        },
        confirmModal: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        },
        confirmTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1f36',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
        },
        confirmMessage: {
            color: '#6b7280',
            marginBottom: '25px',
            fontSize: '15px',
            lineHeight: '1.6'
        },
        confirmButtonGroup: {
            display: 'flex',
            gap: '15px'
        },
        confirmDeleteButton: {
            flex: '1',
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: '#DC2626',
                transform: 'translateY(-2px)'
            }
        },
        confirmCancelButton: {
            flex: '1',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: '#4b5563',
                transform: 'translateY(-2px)'
            }
        },
        warningIcon: {
            fontSize: '40px',
            color: '#F59E0B',
            marginBottom: '15px'
        },
        formatPreview: {
            backgroundColor: '#f9fafb',
            padding: '10px',
            borderRadius: '6px',
            marginTop: '10px',
            border: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#6b7280'
        }
    };

    // Add animation style
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
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
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Topic Management</h2>
                    <p style={styles.subtitle}>Create and manage topics for lessons</p>
                </div>
            </div>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search Topics..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    style={styles.addButton}
                    onClick={() => {
                        setNewTopic({
                            className: '',
                            subjectName: '',
                            lessonName: '',
                            videoLink: '',
                            topicHeading: '',
                            topicContent: '',
                            file: null
                        });
                        setEditingTopic(null);
                        setShowAddForm(true);
                    }}
                >
                    <span>➕</span>
                    Add Topic
                </button>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th style={styles.th}>Class Name</th>
                            <th style={styles.th}>Topic Name</th>
                            <th style={styles.th}>Subject Name</th>
                            <th style={styles.th}>Lesson Name</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTopics.length > 0 ? (
                            filteredTopics.map(topic => (
                                <tr key={topic.id}>
                                    <td style={styles.td}>{topic.className}</td>
                                    <td style={styles.td}>{topic.topicName}</td>
                                    <td style={styles.td}>{topic.subjectName}</td>
                                    <td style={styles.td}>{topic.lessonName}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                style={styles.editButton}
                                                onClick={() => handleEditTopic(topic)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => showDeleteConfirmation(topic.id, topic.topicName)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>
                                    No Topics Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddForm && (
                <div style={styles.modalOverlay} onClick={() => setShowAddForm(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                {editingTopic ? 'Edit Topic' : 'Topic Master Page'}
                            </h3>
                        </div>

                        <div style={{ flex: '1', overflowY: 'auto', paddingRight: '5px' }}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Class Name</label>
                                    <select
                                        style={styles.select}
                                        name="className"
                                        value={newTopic.className}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Subject Name</label>
                                    <select
                                        style={styles.select}
                                        name="subjectName"
                                        value={newTopic.subjectName}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Lesson Name</label>
                                    <select
                                        style={styles.select}
                                        name="lessonName"
                                        value={newTopic.lessonName}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Lesson</option>
                                        {lessons.map(lesson => (
                                            <option key={lesson} value={lesson}>{lesson}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Video Link</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    name="videoLink"
                                    placeholder="Enter Video Link"
                                    value={newTopic.videoLink}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Topic Heading</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    name="topicHeading"
                                    placeholder="Enter Topic Heading"
                                    value={newTopic.topicHeading}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Topic Content</label>
                                <div style={{ marginBottom: '10px' }}>
                                    <button
                                        style={styles.normalButton}
                                        onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
                                    >
                                        Normal : B I U ... ≡ I_x
                                    </button>
                                </div>

                                {showFormattingToolbar && (
                                    <div style={styles.formattingToolbar}>
                                        <div style={styles.toolbarTitle}>Formatting Tools:</div>
                                        <div style={styles.toolbarButtons}>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('heading1')}
                                                title="Heading 1"
                                            >
                                                H1
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('heading2')}
                                                title="Heading 2"
                                            >
                                                H2
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('heading3')}
                                                title="Heading 3"
                                            >
                                                H3
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('normal')}
                                                title="Normal Text"
                                            >
                                                Normal
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('bold')}
                                                title="Bold"
                                            >
                                                <strong>B</strong>
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('italic')}
                                                title="Italic"
                                            >
                                                <em>I</em>
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('underline')}
                                                title="Underline"
                                            >
                                                <u>U</u>
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => setShowHyperlinkModal(true)}
                                                title="Insert Hyperlink"
                                            >
                                                🔗
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('numberedList')}
                                                title="Numbered List"
                                            >
                                                1.
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('superscript')}
                                                title="Superscript"
                                            >
                                                X²
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('subscript')}
                                                title="Subscript"
                                            >
                                                Tₓ
                                            </button>
                                        </div>
                                        <div style={styles.formatPreview}>
                                            <strong>Tip:</strong> Select text first, then click formatting buttons
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    ref={textareaRef}
                                    style={styles.textarea}
                                    name="topicContent"
                                    placeholder="Enter Topic Content"
                                    value={newTopic.topicContent}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Topic Path (Max 2 MB, PDF only)</label>
                                <input
                                    type="file"
                                    style={styles.fileInput}
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                    {newTopic.file ? newTopic.file.name : 'No file chosen'}
                                </div>
                            </div>
                        </div>

                        <div style={styles.buttonGroup}>
                            <button
                                style={styles.saveButton}
                                onClick={handleSaveTopic}
                            >
                                {editingTopic ? 'Update Topic' : 'Save'}
                            </button>
                            <button
                                style={styles.cancelButton}
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showHyperlinkModal && (
                <div style={styles.modalOverlay} onClick={() => setShowHyperlinkModal(false)}>
                    <div style={styles.hyperlinkModal} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '15px', color: '#1a1f36' }}>Insert Hyperlink</h3>
                        <div style={styles.hyperlinkForm}>
                            <input
                                type="text"
                                placeholder="URL (https://example.com)"
                                value={hyperlinkUrl}
                                onChange={(e) => setHyperlinkUrl(e.target.value)}
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Link Text (optional)"
                                value={hyperlinkText}
                                onChange={(e) => setHyperlinkText(e.target.value)}
                                style={styles.input}
                            />
                            <div style={styles.hyperlinkButtonGroup}>
                                <button
                                    style={{ ...styles.saveButton, padding: '10px' }}
                                    onClick={handleAddHyperlink}
                                >
                                    Insert Link
                                </button>
                                <button
                                    style={{ ...styles.cancelButton, padding: '10px' }}
                                    onClick={() => setShowHyperlinkModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm.show && (
                <div style={styles.modalOverlay} onClick={cancelDelete}>
                    <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.warningIcon}>⚠️</div>
                        <h3 style={styles.confirmTitle}>Delete Confirmation</h3>
                        <p style={styles.confirmMessage}>
                            Are you sure you want to delete the topic:<br />
                            <strong style={{ color: '#1a1f36' }}>"{showDeleteConfirm.topicName}"</strong>?
                        </p>
                        <p style={{ ...styles.confirmMessage, fontSize: '13px', color: '#9ca3af' }}>
                            This action cannot be undone.
                        </p>
                        <div style={styles.confirmButtonGroup}>
                            <button
                                style={styles.confirmCancelButton}
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.confirmDeleteButton}
                                onClick={handleDeleteTopic}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {snackbar.show && (
                <div style={{
                    ...styles.snackbar,
                    ...(snackbar.type === 'error' ? styles.snackbarError :
                        snackbar.type === 'info' ? styles.snackbarInfo : styles.snackbarSuccess)
                }}>
                    <span style={styles.snackbarIcon}>
                        {snackbar.type === 'error' ? '❌' :
                            snackbar.type === 'info' ? 'ℹ️' : '✅'}
                    </span>
                    {snackbar.message}
                </div>
            )}
        </div>
    );
};

export default Topic;