import React, { useState, useEffect } from 'react';

const Lesson = () => {
    const [lessons, setLessons] = useState([
        { id: 1, name: 'English Poems', class: 'LKG', content: 'Twinkle, twinkle, little star, H' },
        { id: 2, name: 'Addition', class: 'Nur', content: 'Addition is the fundamental' },
        { id: 3, name: 'English Poem', class: 'LKG', content: 'Mary had a little lamb, Its fle' }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newLesson, setNewLesson] = useState({
        class: '',
        subject: '',
        name: '',
        content: '',
        file: null
    });

    const [editingLesson, setEditingLesson] = useState(null);
    const [viewingLesson, setViewingLesson] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, lessonId: null, lessonName: '' });

    // Mock data for dropdowns
    const classes = ['LKG', 'UKG', 'Nur', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => {
            setSnackbar({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLesson(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setNewLesson(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleSaveLesson = () => {
        if (!newLesson.name || !newLesson.class || !newLesson.content) {
            showSnackbar('Please fill all required fields', 'error');
            return;
        }

        if (editingLesson) {
            // Update existing lesson
            setLessons(lessons.map(lesson =>
                lesson.id === editingLesson.id
                    ? {
                        ...lesson,
                        name: newLesson.name,
                        class: newLesson.class,
                        content: newLesson.content.substring(0, 50) + '...',
                        fullContent: newLesson.content,
                        subject: newLesson.subject,
                        fileName: newLesson.file ? newLesson.file.name : lesson.fileName
                    }
                    : lesson
            ));
            showSnackbar('Lesson updated successfully!');
            setEditingLesson(null);
        } else {
            // Add new lesson
            const newLessonObj = {
                id: lessons.length + 1,
                name: newLesson.name,
                class: newLesson.class,
                content: newLesson.content.substring(0, 50) + '...',
                fullContent: newLesson.content,
                subject: newLesson.subject,
                fileName: newLesson.file ? newLesson.file.name : null
            };

            setLessons([...lessons, newLessonObj]);
            showSnackbar('Lesson saved successfully!');
        }

        setNewLesson({
            class: '',
            subject: '',
            name: '',
            content: '',
            file: null
        });
        setShowAddForm(false);
    };

    const handleViewLesson = (lesson) => {
        setViewingLesson(lesson);
    };

    const handleEditLesson = (lesson) => {
        setNewLesson({
            class: lesson.class,
            subject: lesson.subject || '',
            name: lesson.name,
            content: lesson.fullContent || lesson.content,
            file: null
        });
        setEditingLesson(lesson);
        setShowAddForm(true);
    };

    const showDeleteConfirmation = (lessonId, lessonName) => {
        setShowDeleteConfirm({ show: true, lessonId, lessonName });
    };

    const handleDeleteLesson = () => {
        const { lessonId } = showDeleteConfirm;
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
        showSnackbar('Lesson deleted successfully!');
        setShowDeleteConfirm({ show: false, lessonId: null, lessonName: '' });
    };

    const cancelDelete = () => {
        setShowDeleteConfirm({ show: false, lessonId: null, lessonName: '' });
        showSnackbar('Deletion cancelled', 'info');
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.class.toLowerCase().includes(searchTerm.toLowerCase())
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
            backgroundColor: '#4CAF50',
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
                backgroundColor: '#388E3C',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
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
        viewButton: {
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s',
            '&:hover': {
                backgroundColor: '#2563EB',
                transform: 'translateY(-1px)'
            }
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
            width: '500px',
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
            minHeight: '120px',
            resize: 'vertical',
            outline: 'none',
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
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: '#388E3C'
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
        viewModalContent: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
        },
        lessonContent: {
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '15px',
            border: '1px solid #e5e7eb',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
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
                    <h2 style={styles.title}>Lesson Management</h2>
                    <p style={styles.subtitle}>Create and manage lessons for different classes</p>
                </div>
            </div>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search Lessons..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    style={styles.addButton}
                    onClick={() => {
                        setNewLesson({
                            class: '',
                            subject: '',
                            name: '',
                            content: '',
                            file: null
                        });
                        setEditingLesson(null);
                        setShowAddForm(true);
                    }}
                >
                    <span>➕</span>
                    Add Lesson
                </button>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th style={styles.th}>Lesson Name</th>
                            <th style={styles.th}>Class</th>
                            <th style={styles.th}>Content</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.length > 0 ? (
                            filteredLessons.map(lesson => (
                                <tr key={lesson.id}>
                                    <td style={styles.td}>{lesson.name}</td>
                                    <td style={styles.td}>{lesson.class}</td>
                                    <td style={styles.td}>{lesson.content}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                style={styles.viewButton}
                                                onClick={() => handleViewLesson(lesson)}
                                            >
                                                View
                                            </button>
                                            <button
                                                style={styles.editButton}
                                                onClick={() => handleEditLesson(lesson)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => showDeleteConfirmation(lesson.id, lesson.name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>
                                    No lessons found
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
                                {editingLesson ? 'Edit Lesson' : 'Add Lesson'}
                            </h3>
                        </div>

                        <div style={{ flex: '1', overflowY: 'auto', paddingRight: '5px' }}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Class</label>
                                <select
                                    style={styles.select}
                                    name="class"
                                    value={newLesson.class}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Subject</label>
                                <select
                                    style={styles.select}
                                    name="subject"
                                    value={newLesson.subject}
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
                                <input
                                    type="text"
                                    style={styles.input}
                                    name="name"
                                    placeholder="Enter Lesson Name"
                                    value={newLesson.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Lesson Content</label>
                                <textarea
                                    style={styles.textarea}
                                    name="content"
                                    placeholder="Enter Lesson Content"
                                    value={newLesson.content}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Lesson Path (Max 2 MB, PDF only)</label>
                                <input
                                    type="file"
                                    style={styles.fileInput}
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                    {newLesson.file ? newLesson.file.name : 'No file chosen'}
                                </div>
                            </div>
                        </div>

                        <div style={styles.buttonGroup}>
                            <button
                                style={styles.saveButton}
                                onClick={handleSaveLesson}
                            >
                                {editingLesson ? 'Update Lesson' : 'Save Lesson'}
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

            {viewingLesson && (
                <div style={styles.modalOverlay} onClick={() => setViewingLesson(null)}>
                    <div style={styles.viewModalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{viewingLesson.name}</h3>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Class</label>
                            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                                {viewingLesson.class}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Subject</label>
                            <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                                {viewingLesson.subject || 'Not specified'}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Content</label>
                            <div style={styles.lessonContent}>
                                {viewingLesson.fullContent || viewingLesson.content}
                            </div>
                        </div>

                        {viewingLesson.fileName && (
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Attached File</label>
                                <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                                    📄 {viewingLesson.fileName}
                                </div>
                            </div>
                        )}

                        <div style={{ ...styles.buttonGroup, justifyContent: 'center' }}>
                            <button
                                style={styles.cancelButton}
                                onClick={() => setViewingLesson(null)}
                            >
                                Close
                            </button>
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
                            Are you sure you want to delete the lesson:<br />
                            <strong style={{ color: '#1a1f36' }}>"{showDeleteConfirm.lessonName}"</strong>?
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
                                onClick={handleDeleteLesson}
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

export default Lesson;