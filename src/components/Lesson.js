import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const Lesson = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLesson, setNewLesson] = useState({
        lessonName: '',
        className: '',
        content: '',
        subject: ''
    });
    const [editingLesson, setEditingLesson] = useState(null);
    const [viewingLesson, setViewingLesson] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ show: false, text: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({
        show: false,
        lessonId: null,
        lessonName: ''
    });

    // Mock data for dropdowns
    const classes = ['LKG', 'UKG', 'Nur', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
        'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12'];
    const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi',
        'Computer Science', 'Physics', 'Chemistry', 'Biology'];

    // Fetch lessons using useCallback
    const fetchLessons = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/lessons`);
            if (response.data.success) {
                setLessons(response.data.lessons);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            showMessage('Error fetching lessons. Make sure backend is running.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    const showMessage = (text, type = 'success') => {
        setMessage({ show: true, text, type });
        setTimeout(() => {
            setMessage({ show: false, text: '', type: '' });
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLesson(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveLesson = async () => {
        try {
            if (!newLesson.lessonName || !newLesson.className || !newLesson.content) {
                showMessage('Please fill all required fields', 'error');
                return;
            }

            let response;
            if (editingLesson) {
                response = await axios.put(
                    `${API_BASE_URL}/lessons/${editingLesson._id}`,
                    newLesson
                );

                if (response.data.success) {
                    showMessage('Lesson updated successfully!');
                }
            } else {
                response = await axios.post(`${API_BASE_URL}/lessons`, newLesson);

                if (response.data.success) {
                    showMessage('Lesson created successfully!');
                }
            }

            await fetchLessons();
            setNewLesson({ lessonName: '', className: '', content: '', subject: '' });
            setEditingLesson(null);
            setShowAddForm(false);

        } catch (error) {
            console.error('Error saving lesson:', error);
            showMessage('Error saving lesson. Please try again.', 'error');
        }
    };

    const handleViewLesson = (lesson) => {
        setViewingLesson(lesson);
    };

    const handleEditLesson = (lesson) => {
        setNewLesson({
            lessonName: lesson.lessonName,
            className: lesson.className,
            content: lesson.content,
            subject: lesson.subject || ''
        });
        setEditingLesson(lesson);
        setShowAddForm(true);
    };

    const handleDeleteLesson = async () => {
        const { lessonId } = showDeleteConfirm;

        try {
            const response = await axios.delete(`${API_BASE_URL}/lessons/${lessonId}`);

            if (response.data.success) {
                showMessage('Lesson deleted successfully!');
                await fetchLessons();
            }
        } catch (error) {
            console.error('Error deleting lesson:', error);
            showMessage('Error deleting lesson', 'error');
        }

        setShowDeleteConfirm({ show: false, lessonId: null, lessonName: '' });
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.lessonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Updated styles with fixed button position
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
            backgroundColor: '#4caf50',
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
        viewButton: {
            backgroundColor: '#2196f3',
            color: 'white'
        },
        editButton: {
            backgroundColor: '#ff9800',
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
            maxWidth: '500px',
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
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#fafafa',
            cursor: 'pointer'
        },
        buttonGroup: {
            display: 'flex',
            gap: '15px'
        },
        saveButton: {
            backgroundColor: '#4caf50',
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
        viewContent: {
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            maxHeight: '400px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: '14px',
            marginTop: '10px'
        },
        confirmText: {
            marginBottom: '25px',
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#444',
            textAlign: 'center'
        },
        warningIcon: {
            fontSize: '48px',
            color: '#ff9800',
            textAlign: 'center',
            marginBottom: '20px'
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
        },
        deleteModalBody: {
            textAlign: 'center',
            padding: '40px 30px'
        }
    };

    // Add hover effects using inline styles
    const hoverStyle = `
    .hover-effect:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      transition: all 0.3s;
    }
    .modal-btn-hover:hover {
      opacity: 0.9;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #4caf50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
  `;

    return (
        <div style={styles.container}>
            {/* Add CSS styles */}
            <style>{hoverStyle}</style>

            <div style={styles.header}>
                <h2 style={styles.title}>Lesson Management</h2>
                <p style={styles.subtitle}>Create and manage lessons for different classes</p>

                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search Lessons..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="hover-effect"
                    />
                    <button
                        style={styles.addButton}
                        onClick={() => {
                            setNewLesson({
                                lessonName: '',
                                className: '',
                                content: '',
                                subject: ''
                            });
                            setEditingLesson(null);
                            setShowAddForm(true);
                        }}
                        className="hover-effect"
                    >
                        <span>+</span>
                        Add Lesson
                    </button>
                </div>
            </div>

            <div style={styles.tableContainer}>
                {loading ? (
                    <div style={styles.loading}>Loading lessons...</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Lesson Name</th>
                                <th style={styles.th}>Class</th>
                                <th style={styles.th}>Subject</th>
                                <th style={styles.th}>Content Preview</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLessons.length > 0 ? (
                                filteredLessons.map((lesson) => (
                                    <tr key={lesson._id}>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {lesson.lessonName}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.lessonBadge}>
                                                {lesson.className}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {lesson.subject && (
                                                <span style={styles.subjectTag}>
                                                    {lesson.subject}
                                                </span>
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ color: '#666', lineHeight: '1.4' }}>
                                                {lesson.content.length > 80
                                                    ? lesson.content.substring(0, 80) + '...'
                                                    : lesson.content}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    style={{ ...styles.button, ...styles.viewButton }}
                                                    onClick={() => handleViewLesson(lesson)}
                                                    className="hover-effect"
                                                    title="View Lesson"
                                                >
                                                    👁️ View
                                                </button>
                                                <button
                                                    style={{ ...styles.button, ...styles.editButton }}
                                                    onClick={() => handleEditLesson(lesson)}
                                                    className="hover-effect"
                                                    title="Edit Lesson"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    style={{ ...styles.button, ...styles.deleteButton }}
                                                    onClick={() => setShowDeleteConfirm({
                                                        show: true,
                                                        lessonId: lesson._id,
                                                        lessonName: lesson.lessonName
                                                    })}
                                                    className="hover-effect"
                                                    title="Delete Lesson"
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
                                            ? `No lessons found for "${searchTerm}"`
                                            : 'No lessons available. Click "Add Lesson" to create your first lesson!'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Form Modal with fixed buttons */}
            {showAddForm && (
                <div style={styles.modalOverlay} onClick={() => setShowAddForm(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                {editingLesson ? '✏️ Edit Lesson' : '➕ Add New Lesson'}
                            </h3>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Class <span style={styles.required}>*</span>
                                </label>
                                <select
                                    style={styles.select}
                                    name="className"
                                    value={newLesson.className}
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
                                    name="subject"
                                    value={newLesson.subject}
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
                                <label style={styles.label}>
                                    Lesson Name <span style={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    name="lessonName"
                                    placeholder="Enter Lesson Name"
                                    value={newLesson.lessonName}
                                    onChange={handleInputChange}
                                    required
                                    className="hover-effect"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Lesson Content <span style={styles.required}>*</span>
                                </label>
                                <textarea
                                    style={styles.textarea}
                                    name="content"
                                    placeholder="Enter detailed lesson content here..."
                                    value={newLesson.content}
                                    onChange={handleInputChange}
                                    required
                                    className="hover-effect"
                                />
                            </div>
                        </div>

                        {/* Fixed Footer with Buttons - Always visible */}
                        <div style={styles.modalFooter}>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.saveButton}
                                    onClick={handleSaveLesson}
                                    className="modal-btn-hover"
                                >
                                    {editingLesson ? 'Update Lesson' : 'Save Lesson'}
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

            {/* View Lesson Modal */}
            {viewingLesson && (
                <div style={styles.modalOverlay} onClick={() => setViewingLesson(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>📚 {viewingLesson.lessonName}</h3>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Class</label>
                                <div style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#e8f5e9',
                                    borderRadius: '8px',
                                    color: '#2e7d32',
                                    fontWeight: '600',
                                    fontSize: '15px'
                                }}>
                                    {viewingLesson.className}
                                </div>
                            </div>

                            {viewingLesson.subject && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Subject</label>
                                    <div style={{
                                        padding: '12px 16px',
                                        backgroundColor: '#f3e5f5',
                                        borderRadius: '8px',
                                        color: '#7b1fa2',
                                        fontWeight: '500'
                                    }}>
                                        {viewingLesson.subject}
                                    </div>
                                </div>
                            )}

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Lesson Content</label>
                                <div style={styles.viewContent}>
                                    {viewingLesson.content}
                                </div>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={{ ...styles.cancelButton, backgroundColor: '#5c6bc0', flex: 1 }}
                                    onClick={() => setViewingLesson(null)}
                                    className="modal-btn-hover"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm.show && (
                <div style={styles.modalOverlay} onClick={() => setShowDeleteConfirm({ show: false, lessonId: null, lessonName: '' })}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.deleteModalBody}>
                            <div style={styles.warningIcon}>⚠️</div>
                            <h3 style={{ ...styles.modalTitle, textAlign: 'center', color: '#d32f2f' }}>Confirm Delete</h3>
                            <div style={styles.confirmText}>
                                Are you sure you want to delete the lesson:<br />
                                <strong style={{ color: '#d32f2f', fontSize: '17px', marginTop: '10px', display: 'inline-block' }}>
                                    "{showDeleteConfirm.lessonName}"?
                                </strong>
                            </div>
                            <p style={{ fontSize: '14px', color: '#757575', marginBottom: '25px' }}>
                                This action cannot be undone. All lesson data will be permanently deleted.
                            </p>
                        </div>

                        <div style={styles.modalFooter}>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.cancelButton}
                                    onClick={() => setShowDeleteConfirm({ show: false, lessonId: null, lessonName: '' })}
                                    className="modal-btn-hover"
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{ ...styles.saveButton, backgroundColor: '#d32f2f' }}
                                    onClick={handleDeleteLesson}
                                    className="modal-btn-hover"
                                >
                                    Delete Permanently
                                </button>
                            </div>
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

            {/* Add slideIn animation */}
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
        `}
            </style>
        </div>
    );
};

export default Lesson;