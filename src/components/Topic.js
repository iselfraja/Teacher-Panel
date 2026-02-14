import React, { useState, useEffect, useCallback, useRef } from 'react';
import { topicAPI, lessonAPI } from '../services/api';

const Topic = () => {
    const [topics, setTopics] = useState([]);
    const [lessons, setLessons] = useState([]); // Lessons from API for dropdown
    const [loading, setLoading] = useState(true);
    const [lessonsLoading, setLessonsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTopic, setNewTopic] = useState({
        className: '',
        subjectName: '',
        lessonName: '',
        videoLink: '',
        topicName: '',
        topicContent: '',
        file: null
    });
    const [editingTopic, setEditingTopic] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormattingToolbar, setShowFormattingToolbar] = useState(true);
    const [showHyperlinkModal, setShowHyperlinkModal] = useState(false);
    const [hyperlinkUrl, setHyperlinkUrl] = useState('');
    const [hyperlinkText, setHyperlinkText] = useState('');
    const [message, setMessage] = useState({ show: false, text: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({
        show: false,
        topicId: null,
        topicName: ''
    });

    const textareaRef = useRef(null);

    // Static data for dropdowns
    const classes = ['LKG', 'UKG', 'Nur', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
        'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12'];
    const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi',
        'Computer Science', 'Physics', 'Chemistry', 'Biology'];

    // Fetch topics and lessons on component mount
    useEffect(() => {
        fetchTopics();
        fetchLessonsForDropdown();
    }, []);

    // Fetch topics from API
    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await topicAPI.getAllTopics();
            if (response.success) {
                setTopics(response.topics);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            showMessage('Error fetching topics. Make sure backend is running.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch lessons for dropdown from API
    const fetchLessonsForDropdown = async () => {
        try {
            setLessonsLoading(true);

            // Try to get lessons from topic API first
            const topicResponse = await topicAPI.getLessonsForDropdown();

            if (topicResponse.success && topicResponse.lessons && topicResponse.lessons.length > 0) {
                // Use lessons from topics
                setLessons(topicResponse.lessons);
            } else {
                // If no lessons in topics, get from lessons API
                const lessonsResponse = await lessonAPI.getAllLessons();
                if (lessonsResponse.success) {
                    // Extract lesson names from lessons
                    const lessonNames = lessonsResponse.lessons.map(lesson => lesson.lessonName);
                    setLessons([...new Set(lessonNames)]); // Remove duplicates
                }
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            // Use static lessons as fallback
            setLessons(['English Poems', 'Addition', 'Basic Mathematics', 'Science Introduction']);
        } finally {
            setLessonsLoading(false);
        }
    };

    // Show message
    const showMessage = (text, type = 'success') => {
        setMessage({ show: true, text, type });
        setTimeout(() => {
            setMessage({ show: false, text: '', type: '' });
        }, 3000);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTopic(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file change
    const handleFileChange = (e) => {
        setNewTopic(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    // Save/Update topic
    const handleSaveTopic = async () => {
        try {
            // Validation
            if (!newTopic.className || !newTopic.topicName || !newTopic.topicContent) {
                showMessage('Please fill all required fields', 'error');
                return;
            }

            // Prepare topic data
            const topicData = {
                className: newTopic.className,
                subjectName: newTopic.subjectName || '',
                lessonName: newTopic.lessonName || '',
                topicName: newTopic.topicName,
                videoLink: newTopic.videoLink || '',
                topicContent: newTopic.topicContent
            };

            if (editingTopic) {
                // Update existing topic
                const response = await topicAPI.updateTopic(editingTopic._id, topicData);
                if (response.success) {
                    showMessage('Topic updated successfully!');
                }
            } else {
                // Create new topic
                const response = await topicAPI.createTopic(topicData);
                if (response.success) {
                    showMessage('Topic created successfully!');
                }
            }

            // Refresh topics list
            await fetchTopics();

            // Reset form
            setNewTopic({
                className: '',
                subjectName: '',
                lessonName: '',
                videoLink: '',
                topicName: '',
                topicContent: '',
                file: null
            });
            setEditingTopic(null);
            setShowAddForm(false);

        } catch (error) {
            console.error('Error saving topic:', error);
            showMessage('Error saving topic. Please try again.', 'error');
        }
    };

    // Edit topic
    const handleEditTopic = (topic) => {
        setNewTopic({
            className: topic.className,
            subjectName: topic.subjectName || '',
            lessonName: topic.lessonName || '',
            videoLink: topic.videoLink || '',
            topicName: topic.topicName,
            topicContent: topic.topicContent || '',
            file: null
        });
        setEditingTopic(topic);
        setShowAddForm(true);
    };

    // Delete topic
    const handleDeleteTopic = async () => {
        const { topicId } = showDeleteConfirm;

        try {
            const response = await topicAPI.deleteTopic(topicId);

            if (response.success) {
                showMessage('Topic deleted successfully!');
                await fetchTopics(); // Refresh list
            }
        } catch (error) {
            console.error('Error deleting topic:', error);
            showMessage('Error deleting topic', 'error');
        }

        setShowDeleteConfirm({ show: false, topicId: null, topicName: '' });
    };

    // Formatting functions
    const getSelectedText = () => {
        const textarea = textareaRef.current;
        if (!textarea) return { text: '', start: 0, end: 0 };

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value.substring(start, end);

        return { text, start, end };
    };

    const insertTextAtCursor = (textToInsert) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { start, end } = getSelectedText();
        const value = textarea.value;

        const newValue = value.substring(0, start) + textToInsert + value.substring(end);
        setNewTopic(prev => ({ ...prev, topicContent: newValue }));

        setTimeout(() => {
            textarea.focus();
            const newPosition = start + textToInsert.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 10);
    };

    const wrapSelectedText = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { text, start, end } = getSelectedText();

        if (text) {
            const wrappedText = before + text + after;
            insertTextAtCursor(wrappedText);
        } else {
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
                showMessage('Bold formatting applied');
                break;
            case 'italic':
                wrapSelectedText('*', '*');
                showMessage('Italic formatting applied');
                break;
            case 'underline':
                wrapSelectedText('<u>', '</u>');
                showMessage('Underline formatting applied');
                break;
            case 'superscript':
                wrapSelectedText('<sup>', '</sup>');
                showMessage('Superscript formatting applied');
                break;
            case 'subscript':
                wrapSelectedText('<sub>', '</sub>');
                showMessage('Subscript formatting applied');
                break;
            case 'heading1':
                wrapSelectedText('# ', '');
                showMessage('Heading 1 formatting applied');
                break;
            case 'heading2':
                wrapSelectedText('## ', '');
                showMessage('Heading 2 formatting applied');
                break;
            case 'heading3':
                wrapSelectedText('### ', '');
                showMessage('Heading 3 formatting applied');
                break;
            case 'normal':
                const { text, start, end } = getSelectedText();
                if (text) {
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
                    showMessage('Normal formatting applied');
                }
                break;
            case 'numberedList':
                insertTextAtCursor('1. First item\n2. Second item\n3. Third item');
                showMessage('Numbered list inserted');
                break;
            default:
                break;
        }
    };

    const handleAddHyperlink = () => {
        if (!hyperlinkUrl) {
            showMessage('Please enter a URL', 'error');
            return;
        }

        wrapSelectedText('[', `](${hyperlinkUrl})`);

        setHyperlinkUrl('');
        setHyperlinkText('');
        setShowHyperlinkModal(false);
        showMessage('Hyperlink added successfully!');
    };

    const cancelDelete = () => {
        setShowDeleteConfirm({ show: false, topicId: null, topicName: '' });
        showMessage('Deletion cancelled', 'info');
    };

    // Filter topics based on search
    const filteredTopics = topics.filter(topic =>
        topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (topic.subjectName && topic.subjectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Styles
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 40px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        header: {
            marginBottom: '30px'
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '5px',
            color: '#1a237e'
        },
        subtitle: {
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
        },
        searchContainer: {
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
            alignItems: 'center'
        },
        searchInput: {
            flex: 1,
            padding: '12px 20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#fafafa'
        },
        addButton: {
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        tableContainer: {
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
        },
        th: {
            backgroundColor: '#f5f5f5',
            padding: '16px 20px',
            textAlign: 'left',
            borderBottom: '2px solid #e0e0e0',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
        },
        td: {
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            verticalAlign: 'top',
            fontSize: '14px',
            color: '#555'
        },
        actionButtons: {
            display: 'flex',
            gap: '10px'
        },
        button: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        editButton: {
            backgroundColor: '#10B981',
            color: 'white'
        },
        deleteButton: {
            backgroundColor: '#f44336',
            color: 'white'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(4px)'
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column'
        },
        modalHeader: {
            padding: '25px 30px 20px',
            borderBottom: '2px solid #e8eaf6',
            flexShrink: 0
        },
        modalTitle: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#1a237e',
            margin: 0
        },
        modalBody: {
            padding: '0 30px',
            overflowY: 'auto',
            flex: 1,
            maxHeight: 'calc(90vh - 160px)'
        },
        modalFooter: {
            padding: '20px 30px',
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #eee',
            position: 'sticky',
            bottom: 0,
            flexShrink: 0
        },
        formRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginBottom: '20px'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#444',
            fontSize: '14px'
        },
        required: {
            color: '#f44336'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#fafafa',
            cursor: 'pointer'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#fafafa'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            minHeight: '150px',
            resize: 'vertical',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#fafafa'
        },
        fileInput: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px dashed #ddd',
            backgroundColor: '#f9f9f9',
            textAlign: 'center',
            cursor: 'pointer'
        },
        buttonGroup: {
            display: 'flex',
            gap: '15px'
        },
        saveButton: {
            backgroundColor: '#667eea',
            color: 'white',
            padding: '14px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            flex: 1
        },
        cancelButton: {
            backgroundColor: '#757575',
            color: 'white',
            padding: '14px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            flex: 1
        },
        formattingToolbar: {
            backgroundColor: '#f3f4f6',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
            border: '1px solid #ddd'
        },
        toolbarTitle: {
            fontSize: '12px',
            color: '#666',
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
            border: '1px solid #ddd',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
            marginBottom: '10px'
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
        message: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '14px 24px',
            borderRadius: '8px',
            color: 'white',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        loading: {
            textAlign: 'center',
            padding: '60px 20px',
            fontSize: '16px',
            color: '#666'
        },
        noData: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999',
            fontSize: '14px'
        },
        confirmModal: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        },
        confirmTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1a1f36',
            marginBottom: '15px'
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
            flex: 1,
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },
        confirmCancelButton: {
            flex: 1,
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },
        warningIcon: {
            fontSize: '48px',
            color: '#ff9800',
            textAlign: 'center',
            marginBottom: '20px'
        },
        formatPreview: {
            backgroundColor: '#f9fafb',
            padding: '10px',
            borderRadius: '6px',
            marginTop: '10px',
            border: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#6b7280'
        },
        lessonBadge: {
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            display: 'inline-block'
        },
        subjectTag: {
            backgroundColor: '#f3e5f5',
            color: '#7b1fa2',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            marginTop: '4px',
            display: 'inline-block'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Topic Management</h2>
                <p style={styles.subtitle}>Create and manage topics for lessons</p>

                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search Topics..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="hover-effect"
                    />
                    <button
                        style={styles.addButton}
                        onClick={() => {
                            setNewTopic({
                                className: '',
                                subjectName: '',
                                lessonName: '',
                                videoLink: '',
                                topicName: '',
                                topicContent: '',
                                file: null
                            });
                            setEditingTopic(null);
                            setShowAddForm(true);
                        }}
                        className="hover-effect"
                    >
                        <span>+</span>
                        Add Topic
                    </button>
                </div>
            </div>

            <div style={styles.tableContainer}>
                {loading ? (
                    <div style={styles.loading}>Loading topics...</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Class</th>
                                <th style={styles.th}>Topic Name</th>
                                <th style={styles.th}>Subject</th>
                                <th style={styles.th}>Lesson</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTopics.length > 0 ? (
                                filteredTopics.map((topic) => (
                                    <tr key={topic._id}>
                                        <td style={styles.td}>
                                            <span style={styles.lessonBadge}>
                                                {topic.className}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {topic.topicName}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            {topic.subjectName && (
                                                <span style={styles.subjectTag}>
                                                    {topic.subjectName}
                                                </span>
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ color: '#666' }}>
                                                {topic.lessonName || 'Not specified'}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    style={{ ...styles.button, ...styles.editButton }}
                                                    onClick={() => handleEditTopic(topic)}
                                                    className="hover-effect"
                                                    title="Edit Topic"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    style={{ ...styles.button, ...styles.deleteButton }}
                                                    onClick={() => setShowDeleteConfirm({
                                                        show: true,
                                                        topicId: topic._id,
                                                        topicName: topic.topicName
                                                    })}
                                                    className="hover-effect"
                                                    title="Delete Topic"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={styles.noData}>
                                        {searchTerm
                                            ? `No topics found for "${searchTerm}"`
                                            : 'No topics available. Click "Add Topic" to create your first topic!'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            {showAddForm && (
                <div style={styles.modalOverlay} onClick={() => setShowAddForm(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                {editingTopic ? '✏️ Edit Topic' : '📝 Add New Topic'}
                            </h3>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Class <span style={styles.required}>*</span>
                                    </label>
                                    <select
                                        style={styles.select}
                                        name="className"
                                        value={newTopic.className}
                                        onChange={handleInputChange}
                                        required
                                        className="hover-effect"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Subject (Optional)</label>
                                    <select
                                        style={styles.select}
                                        name="subjectName"
                                        value={newTopic.subjectName}
                                        onChange={handleInputChange}
                                        className="hover-effect"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Lesson (Optional)</label>
                                    <select
                                        style={styles.select}
                                        name="lessonName"
                                        value={newTopic.lessonName}
                                        onChange={handleInputChange}
                                        className="hover-effect"
                                    >
                                        <option value="">Select Lesson</option>
                                        {lessonsLoading ? (
                                            <option value="" disabled>Loading lessons...</option>
                                        ) : (
                                            lessons.map(lesson => (
                                                <option key={lesson} value={lesson}>{lesson}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Video Link (Optional)</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    name="videoLink"
                                    placeholder="Enter Video Link (https://youtube.com/...)"
                                    value={newTopic.videoLink}
                                    onChange={handleInputChange}
                                    className="hover-effect"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Topic Name <span style={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    name="topicName"
                                    placeholder="Enter Topic Name"
                                    value={newTopic.topicName}
                                    onChange={handleInputChange}
                                    required
                                    className="hover-effect"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Topic Content <span style={styles.required}>*</span>
                                </label>
                                <div style={{ marginBottom: '10px' }}>
                                    <button
                                        style={styles.normalButton}
                                        onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
                                        className="hover-effect"
                                    >
                                        {showFormattingToolbar ? 'Hide Formatting Tools' : 'Show Formatting Tools'}
                                    </button>
                                </div>

                                {showFormattingToolbar && (
                                    <div style={styles.formattingToolbar}>
                                        <div style={styles.toolbarTitle}>Formatting Tools:</div>
                                        <div style={styles.toolbarButtons}>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('heading1')}
                                                className="hover-effect"
                                                title="Heading 1"
                                            >
                                                H1
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('heading2')}
                                                className="hover-effect"
                                                title="Heading 2"
                                            >
                                                H2
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('heading3')}
                                                className="hover-effect"
                                                title="Heading 3"
                                            >
                                                H3
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('bold')}
                                                className="hover-effect"
                                                title="Bold"
                                            >
                                                <strong>B</strong>
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('italic')}
                                                className="hover-effect"
                                                title="Italic"
                                            >
                                                <em>I</em>
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('underline')}
                                                className="hover-effect"
                                                title="Underline"
                                            >
                                                <u>U</u>
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => setShowHyperlinkModal(true)}
                                                className="hover-effect"
                                                title="Insert Hyperlink"
                                            >
                                                🔗
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('superscript')}
                                                className="hover-effect"
                                                title="Superscript"
                                            >
                                                X²
                                            </button>
                                            <button
                                                style={styles.formatButton}
                                                onClick={() => applyFormat('subscript')}
                                                className="hover-effect"
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
                                    placeholder="Enter detailed topic content here..."
                                    value={newTopic.topicContent}
                                    onChange={handleInputChange}
                                    required
                                    className="hover-effect"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Attachment (Optional)</label>
                                <input
                                    type="file"
                                    style={styles.fileInput}
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hover-effect"
                                />
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                    {newTopic.file ? newTopic.file.name : 'No file chosen'}
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer with Buttons */}
                        <div style={styles.modalFooter}>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.saveButton}
                                    onClick={handleSaveTopic}
                                    className="modal-btn-hover"
                                >
                                    {editingTopic ? 'Update Topic' : 'Save Topic'}
                                </button>
                                <button
                                    style={styles.cancelButton}
                                    onClick={() => setShowAddForm(false)}
                                    className="modal-btn-hover"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hyperlink Modal */}
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
                                className="hover-effect"
                            />
                            <input
                                type="text"
                                placeholder="Link Text (optional)"
                                value={hyperlinkText}
                                onChange={(e) => setHyperlinkText(e.target.value)}
                                style={styles.input}
                                className="hover-effect"
                            />
                            <div style={styles.hyperlinkButtonGroup}>
                                <button
                                    style={{ ...styles.saveButton, padding: '10px' }}
                                    onClick={handleAddHyperlink}
                                    className="modal-btn-hover"
                                >
                                    Insert Link
                                </button>
                                <button
                                    style={{ ...styles.cancelButton, padding: '10px' }}
                                    onClick={() => setShowHyperlinkModal(false)}
                                    className="modal-btn-hover"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm.show && (
                <div style={styles.modalOverlay} onClick={cancelDelete}>
                    <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.warningIcon}>⚠️</div>
                        <h3 style={styles.confirmTitle}>Confirm Delete</h3>
                        <div style={styles.confirmMessage}>
                            Are you sure you want to delete the topic:<br />
                            <strong style={{ color: '#d32f2f', fontSize: '17px' }}>
                                "{showDeleteConfirm.topicName}"?
                            </strong>
                        </div>
                        <p style={{ fontSize: '14px', color: '#757575', marginBottom: '25px' }}>
                            This action cannot be undone.
                        </p>
                        <div style={styles.confirmButtonGroup}>
                            <button
                                style={styles.confirmCancelButton}
                                onClick={cancelDelete}
                                className="modal-btn-hover"
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.confirmDeleteButton}
                                onClick={handleDeleteTopic}
                                className="modal-btn-hover"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Message */}
            {message.show && (
                <div style={{
                    ...styles.message,
                    backgroundColor: message.type === 'error' ? '#d32f2f' :
                        message.type === 'warning' ? '#ff9800' : '#4caf50',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <span style={{ fontSize: '18px' }}>
                        {message.type === 'error' ? '❌' :
                            message.type === 'warning' ? '⚠️' : '✅'}
                    </span>
                    {message.text}
                </div>
            )}

            {/* Add CSS */}
            <style>
                {`
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
          
          .hover-effect:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            transition: all 0.2s;
          }
          
          .modal-btn-hover:hover {
            opacity: 0.9;
          }
          
          input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        `}
            </style>
        </div>
    );
};

export default Topic;