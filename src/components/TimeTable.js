import React, { useState, useEffect } from 'react';

const TimeTable = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [timetableData, setTimetableData] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

    const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const sections = ['A', 'B', 'C', 'D', 'E'];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = [
        { id: 1, start: '8:00 AM', end: '8:45 AM' },
        { id: 2, start: '8:45 AM', end: '9:30 AM' },
        { id: 3, start: '9:30 AM', end: '10:15 AM' },
        { id: 4, start: '10:15 AM', end: '11:00 AM' },
        { id: 5, start: '11:15 AM', end: '12:00 PM' },
        { id: 6, start: '12:00 PM', end: '12:45 PM' },
        { id: 7, start: '1:30 PM', end: '2:15 PM' },
        { id: 8, start: '2:15 PM', end: '3:00 PM' },
    ];

    const subjects = [
        'Mathematics', 'English', 'Science', 'Social Studies', 'Hindi',
        'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History',
        'Geography', 'Economics', 'Business Studies', 'Physical Education', 'Art'
    ];

    // Initial state for new timetable
    const initialTimetableState = days.reduce((acc, day) => {
        acc[day] = periods.map(period => ({
            period: period.id,
            subject: '',
            teacher: '',
            room: ''
        }));
        return acc;
    }, {});

    const [newTimetable, setNewTimetable] = useState(initialTimetableState);

    // Show snackbar notification
    const showSnackbar = (message, type = 'info') => {
        setSnackbar({ open: true, message, type });
        setTimeout(() => {
            setSnackbar({ ...snackbar, open: false });
        }, 3000);
    };

    // Show confirmation dialog
    const showConfirmation = (message, onConfirm) => {
        setConfirmDialog({ open: true, message, onConfirm });
    };

    // Close confirmation dialog
    const closeConfirmation = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    // Handle confirmation
    const handleConfirm = () => {
        if (confirmDialog.onConfirm) {
            confirmDialog.onConfirm();
        }
        closeConfirmation();
    };

    // Load timetable from localStorage on component mount
    useEffect(() => {
        const savedTimetable = localStorage.getItem('timetable');
        if (savedTimetable) {
            setTimetableData(JSON.parse(savedTimetable));
        }
    }, []);

    // Handle class selection
    const handleClassSelect = (e) => {
        setSelectedClass(e.target.value);
        checkTimetableExists(e.target.value, selectedSection);
    };

    // Handle section selection
    const handleSectionSelect = (e) => {
        setSelectedSection(e.target.value);
        checkTimetableExists(selectedClass, e.target.value);
    };

    // Check if timetable exists for the selected class and section
    const checkTimetableExists = (cls, section) => {
        if (!cls || !section) return;

        // For demo purposes, we'll assume timetable exists for Class 10, Section A
        if (cls === 'Class 10' && section === 'A' && timetableData) {
            return;
        } else {
            setTimetableData(null);
        }
    };

    // Show timetable button handler
    const handleShowTimetable = () => {
        if (!selectedClass || !selectedSection) {
            showSnackbar('Please select both class and section', 'warning');
            return;
        }

        // For demo, we'll simulate fetching timetable
        // If timetable exists for Class 10, Section A, show it
        if (selectedClass === 'Class 10' && selectedSection === 'A') {
            // Load a sample timetable
            const sampleTimetable = {
                class: 'Class 10',
                section: 'A',
                timetable: initialTimetableState
            };

            // Set some sample data
            const updatedTimetable = { ...sampleTimetable };
            updatedTimetable.timetable.Monday[0] = { period: 1, subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 101' };
            updatedTimetable.timetable.Monday[1] = { period: 2, subject: 'English', teacher: 'Ms. Gupta', room: 'Room 102' };
            updatedTimetable.timetable.Tuesday[2] = { period: 3, subject: 'Science', teacher: 'Mr. Verma', room: 'Lab 1' };
            updatedTimetable.timetable.Wednesday[3] = { period: 4, subject: 'Social Studies', teacher: 'Ms. Kapoor', room: 'Room 104' };
            updatedTimetable.timetable.Thursday[4] = { period: 5, subject: 'Hindi', teacher: 'Mr. Singh', room: 'Room 105' };
            updatedTimetable.timetable.Friday[5] = { period: 6, subject: 'Computer Science', teacher: 'Ms. Reddy', room: 'Computer Lab' };
            updatedTimetable.timetable.Saturday[6] = { period: 7, subject: 'Physical Education', teacher: 'Mr. Kumar', room: 'Ground' };

            setTimetableData(updatedTimetable);
            localStorage.setItem('timetable', JSON.stringify(updatedTimetable));
            showSnackbar(`Timetable for ${selectedClass} - Section ${selectedSection} loaded successfully`, 'success');
        } else {
            // No timetable exists
            setTimetableData(null);
            showSnackbar(`No timetable found for ${selectedClass} - Section ${selectedSection}`, 'info');
        }
    };

    // Handle creating new timetable
    const handleCreateTimetable = () => {
        if (!selectedClass || !selectedSection) {
            showSnackbar('Please select both class and section before creating timetable', 'warning');
            return;
        }

        setIsEditing(false);
        setShowCreateForm(true);
        setNewTimetable(initialTimetableState);
        showSnackbar('Creating new timetable. Fill in all the details below.', 'info');
    };

    // Handle editing existing timetable
    const handleEditTimetable = () => {
        if (!timetableData) return;

        setIsEditing(true);
        setShowCreateForm(true);
        setNewTimetable(timetableData.timetable);
        showSnackbar('Editing existing timetable. Make your changes below.', 'info');
    };

    // Handle saving timetable
    const handleSaveTimetable = () => {
        // Check if at least one subject is filled
        const hasSubjects = Object.values(newTimetable).some(day =>
            day.some(period => period.subject !== '')
        );

        if (!hasSubjects) {
            showSnackbar('Please add at least one subject to the timetable', 'warning');
            return;
        }

        const timetableToSave = {
            class: selectedClass,
            section: selectedSection,
            timetable: newTimetable
        };

        setTimetableData(timetableToSave);
        localStorage.setItem('timetable', JSON.stringify(timetableToSave));
        setShowCreateForm(false);
        showSnackbar('Timetable saved successfully!', 'success');
    };

    // Handle input change in timetable form
    const handleTimetableChange = (day, periodIndex, field, value) => {
        const updatedTimetable = { ...newTimetable };
        updatedTimetable[day][periodIndex][field] = value;
        setNewTimetable(updatedTimetable);
    };

    // Handle cancel timetable creation
    const handleCancelCreate = () => {
        setShowCreateForm(false);
        setNewTimetable(initialTimetableState);
        showSnackbar('Timetable creation cancelled', 'info');
    };

    // Handle delete timetable
    const handleDeleteTimetable = () => {
        showConfirmation(
            'Are you sure you want to delete this timetable? This action cannot be undone.',
            () => {
                setTimetableData(null);
                localStorage.removeItem('timetable');
                showSnackbar('Timetable deleted successfully', 'success');
            }
        );
    };

    // Inline CSS styles
    const styles = {
        container: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: 'relative',
            minHeight: '500px'
        },
        header: {
            color: '#2c3e50',
            marginBottom: '25px',
            borderBottom: '2px solid #4a6ee0',
            paddingBottom: '10px',
            fontWeight: '600'
        },
        selectionContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '30px',
            alignItems: 'flex-end',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eaeaea'
        },
        formGroup: {
            flex: '1',
            minWidth: '200px'
        },
        formLabel: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057'
        },
        formSelect: {
            width: '100%',
            padding: '10px 15px',
            border: '1px solid #ced4da',
            borderRadius: '6px',
            backgroundColor: 'white',
            fontSize: '16px',
            color: '#495057',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
        },
        formSelectFocus: {
            borderColor: '#4a6ee0',
            outline: '0',
            boxShadow: '0 0 0 0.2rem rgba(74, 110, 224, 0.25)'
        },
        btn: {
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
        },
        btnPrimary: {
            backgroundColor: '#4a6ee0',
            color: 'white'
        },
        btnPrimaryHover: {
            backgroundColor: '#3a5bc7',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(74, 110, 224, 0.3)'
        },
        showTimetableBtn: {
            height: '44px',
            minWidth: '180px'
        },
        noTimetableContainer: {
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px dashed #dee2e6'
        },
        noTimetableMessage: {
            color: '#6c757d',
            fontSize: '16px',
            maxWidth: '500px',
            margin: '0 auto 25px',
            lineHeight: '1.6'
        },
        btnCreateTimetable: {
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px'
        },
        btnCreateTimetableHover: {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)'
        },
        timetableView: {
            marginTop: '20px'
        },
        timetableHeaderInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '1px solid #eaeaea'
        },
        timetableActions: {
            display: 'flex',
            gap: '10px'
        },
        btnEdit: {
            backgroundColor: '#ffc107',
            color: '#212529'
        },
        btnEditHover: {
            backgroundColor: '#e0a800',
            transform: 'translateY(-2px)'
        },
        btnDelete: {
            backgroundColor: '#dc3545',
            color: 'white'
        },
        btnDeleteHover: {
            backgroundColor: '#c82333',
            transform: 'translateY(-2px)'
        },
        timetableTableContainer: {
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
        },
        timetableTable: {
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
        },
        tableHeader: {
            backgroundColor: '#4a6ee0',
            color: 'white',
            padding: '15px 10px',
            textAlign: 'center',
            fontWeight: '600',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        },
        firstHeader: {
            backgroundColor: '#3a5bc7'
        },
        secondHeaderRow: {
            backgroundColor: '#5a7ce8',
            fontSize: '14px',
            fontWeight: '500'
        },
        tableCell: {
            padding: '12px 10px',
            border: '1px solid #dee2e6',
            textAlign: 'center'
        },
        timeCell: {
            backgroundColor: '#f8f9fa',
            fontWeight: '600',
            color: '#495057',
            minWidth: '100px'
        },
        periodCell: {
            verticalAlign: 'top',
            height: '80px',
            width: '14%'
        },
        periodInfo: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        subjectName: {
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '5px'
        },
        teacherName: {
            fontSize: '13px',
            color: '#6c757d'
        },
        roomNumber: {
            fontSize: '13px',
            color: '#6c757d'
        },
        periodEmpty: {
            color: '#adb5bd',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        },
        createTimetableContainer: {
            marginTop: '20px'
        },
        createTimetableHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
            paddingBottom: '15px',
            borderBottom: '1px solid #eaeaea'
        },
        createTimetableActions: {
            display: 'flex',
            gap: '10px'
        },
        btnSave: {
            backgroundColor: '#28a745',
            color: 'white'
        },
        btnSaveHover: {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)'
        },
        btnCancel: {
            backgroundColor: '#6c757d',
            color: 'white'
        },
        btnCancelHover: {
            backgroundColor: '#5a6268',
            transform: 'translateY(-2px)'
        },
        timetableFormContainer: {
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            overflow: 'hidden'
        },
        daysHeader: {
            display: 'flex',
            backgroundColor: '#4a6ee0',
            color: 'white'
        },
        periodLabel: {
            width: '150px',
            padding: '15px',
            fontWeight: '600',
            backgroundColor: '#3a5bc7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        dayHeader: {
            flex: '1',
            padding: '15px 10px',
            textAlign: 'center',
            fontWeight: '600',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        },
        timetableFormRows: {
            maxHeight: '600px',
            overflowY: 'auto'
        },
        timetableFormRow: {
            display: 'flex',
            borderBottom: '1px solid #dee2e6'
        },
        periodTimeInfo: {
            width: '150px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        periodNumber: {
            fontWeight: '600',
            color: '#495057',
            marginBottom: '5px'
        },
        periodTimeRange: {
            fontSize: '13px',
            color: '#6c757d'
        },
        timetableFormCell: {
            flex: '1',
            padding: '10px',
            borderRight: '1px solid #dee2e6',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        subjectSelect: {
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
        },
        teacherInput: {
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
        },
        roomInput: {
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
        },
        formInstructions: {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e7f3ff',
            borderRadius: '6px',
            borderLeft: '4px solid #4a6ee0'
        },
        // Snackbar styles
        snackbarContainer: {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        },
        snackbar: {
            backgroundColor: '#333',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            maxWidth: '500px',
            animation: 'slideUp 0.3s ease-out'
        },
        snackbarSuccess: {
            backgroundColor: '#28a745'
        },
        snackbarWarning: {
            backgroundColor: '#ffc107',
            color: '#212529'
        },
        snackbarError: {
            backgroundColor: '#dc3545'
        },
        snackbarInfo: {
            backgroundColor: '#17a2b8'
        },
        snackbarMessage: {
            flex: '1',
            marginRight: '15px'
        },
        snackbarClose: {
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        // Confirmation dialog styles
        confirmationOverlay: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
        },
        confirmationDialog: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            maxWidth: '500px',
            width: '90%'
        },
        confirmationTitle: {
            marginBottom: '15px',
            color: '#2c3e50',
            fontSize: '20px',
            fontWeight: '600'
        },
        confirmationMessage: {
            marginBottom: '25px',
            color: '#495057',
            fontSize: '16px',
            lineHeight: '1.5'
        },
        confirmationActions: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px'
        },
        btnConfirm: {
            backgroundColor: '#dc3545',
            color: 'white'
        },
        btnConfirmHover: {
            backgroundColor: '#c82333',
            transform: 'translateY(-2px)'
        },
        btnCancelConfirm: {
            backgroundColor: '#6c757d',
            color: 'white'
        },
        btnCancelConfirmHover: {
            backgroundColor: '#5a6268',
            transform: 'translateY(-2px)'
        }
    };

    // Animation for snackbar
    const keyframes = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
  `;

    // Helper function to handle button hover effects
    const handleMouseEnter = (e, hoverStyle) => {
        Object.keys(hoverStyle).forEach(key => {
            e.target.style[key] = hoverStyle[key];
        });
    };

    const handleMouseLeave = (e, originalStyle) => {
        Object.keys(originalStyle).forEach(key => {
            e.target.style[key] = originalStyle[key];
        });
    };

    // Get snackbar style based on type
    const getSnackbarStyle = () => {
        const baseStyle = styles.snackbar;
        switch (snackbar.type) {
            case 'success':
                return { ...baseStyle, ...styles.snackbarSuccess };
            case 'warning':
                return { ...baseStyle, ...styles.snackbarWarning };
            case 'error':
                return { ...baseStyle, ...styles.snackbarError };
            case 'info':
            default:
                return { ...baseStyle, ...styles.snackbarInfo };
        }
    };

    return (
        <>
            <style>{keyframes}</style>

            <div style={styles.container}>
                <h2 style={styles.header}>Time Table Management</h2>

                {/* Selection Controls */}
                <div style={styles.selectionContainer}>
                    <div style={styles.formGroup}>
                        <label htmlFor="classSelect" style={styles.formLabel}>Select Class</label>
                        <select
                            id="classSelect"
                            value={selectedClass}
                            onChange={handleClassSelect}
                            style={styles.formSelect}
                            onFocus={(e) => Object.assign(e.target.style, styles.formSelectFocus)}
                            onBlur={(e) => { e.target.style.borderColor = '#ced4da'; e.target.style.boxShadow = 'none'; }}
                        >
                            <option value="">-- Select Class --</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="sectionSelect" style={styles.formLabel}>Select Section</label>
                        <select
                            id="sectionSelect"
                            value={selectedSection}
                            onChange={handleSectionSelect}
                            style={styles.formSelect}
                            onFocus={(e) => Object.assign(e.target.style, styles.formSelectFocus)}
                            onBlur={(e) => { e.target.style.borderColor = '#ced4da'; e.target.style.boxShadow = 'none'; }}
                        >
                            <option value="">-- Select Section --</option>
                            {sections.map(section => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        style={{ ...styles.btn, ...styles.btnPrimary, ...styles.showTimetableBtn }}
                        onClick={handleShowTimetable}
                        onMouseEnter={(e) => handleMouseEnter(e, styles.btnPrimaryHover)}
                        onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnPrimary, ...styles.showTimetableBtn })}
                    >
                        SHOW TIMETABLE
                    </button>
                </div>

                {/* Timetable Display or Empty State */}
                {!showCreateForm ? (
                    <div>
                        {timetableData ? (
                            <div style={styles.timetableView}>
                                <div style={styles.timetableHeaderInfo}>
                                    <h3>Timetable for {timetableData.class} - Section {timetableData.section}</h3>
                                    <div style={styles.timetableActions}>
                                        <button
                                            style={{ ...styles.btn, ...styles.btnEdit }}
                                            onClick={handleEditTimetable}
                                            onMouseEnter={(e) => handleMouseEnter(e, styles.btnEditHover)}
                                            onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnEdit })}
                                        >
                                            Edit Timetable
                                        </button>
                                        <button
                                            style={{ ...styles.btn, ...styles.btnDelete }}
                                            onClick={handleDeleteTimetable}
                                            onMouseEnter={(e) => handleMouseEnter(e, styles.btnDeleteHover)}
                                            onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnDelete })}
                                        >
                                            Delete Timetable
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.timetableTableContainer}>
                                    <table style={styles.timetableTable}>
                                        <thead>
                                            <tr>
                                                <th style={{ ...styles.tableHeader, ...styles.firstHeader }}>Time</th>
                                                {days.map(day => (
                                                    <th key={day} style={styles.tableHeader}>{day}</th>
                                                ))}
                                            </tr>
                                            <tr>
                                                <th style={{ ...styles.tableHeader, ...styles.firstHeader, ...styles.secondHeaderRow }}>End Time</th>
                                                {days.map(day => (
                                                    <th key={`${day}-period`} style={{ ...styles.tableHeader, ...styles.secondHeaderRow }}>Period</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {periods.map(period => (
                                                <tr key={period.id}>
                                                    <td style={{ ...styles.tableCell, ...styles.timeCell }}>
                                                        <div style={{ padding: '2px 0' }}>{period.start}</div>
                                                        <div style={{ padding: '2px 0' }}>{period.end}</div>
                                                    </td>
                                                    {days.map(day => {
                                                        const periodData = timetableData.timetable[day].find(p => p.period === period.id);
                                                        return (
                                                            <td key={`${day}-${period.id}`} style={{ ...styles.tableCell, ...styles.periodCell }}>
                                                                {periodData && periodData.subject ? (
                                                                    <div style={styles.periodInfo}>
                                                                        <div style={styles.subjectName}>{periodData.subject}</div>
                                                                        <div style={styles.teacherName}>{periodData.teacher}</div>
                                                                        <div style={styles.roomNumber}>{periodData.room}</div>
                                                                    </div>
                                                                ) : (
                                                                    <div style={styles.periodEmpty}>Free</div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div style={styles.noTimetableContainer}>
                                <div style={{ marginBottom: '20px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4a6ee0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                        <path d="M8 14h.01"></path>
                                        <path d="M12 14h.01"></path>
                                        <path d="M16 14h.01"></path>
                                        <path d="M8 18h.01"></path>
                                        <path d="M12 18h.01"></path>
                                        <path d="M16 18h.01"></path>
                                    </svg>
                                </div>
                                <h3 style={{ color: '#495057', marginBottom: '15px', fontWeight: '600' }}>No Timetable Available</h3>
                                <p style={styles.noTimetableMessage}>
                                    {selectedClass && selectedSection
                                        ? `There is no timetable created for ${selectedClass} - Section ${selectedSection}.`
                                        : 'Please select a class and section to view or create a timetable.'}
                                </p>
                                {selectedClass && selectedSection && (
                                    <button
                                        style={{ ...styles.btn, ...styles.btnCreateTimetable }}
                                        onClick={handleCreateTimetable}
                                        onMouseEnter={(e) => handleMouseEnter(e, styles.btnCreateTimetableHover)}
                                        onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnCreateTimetable })}
                                    >
                                        Create New Timetable
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Create/Edit Timetable Form */
                    <div style={styles.createTimetableContainer}>
                        <div style={styles.createTimetableHeader}>
                            <h3 style={{ color: '#2c3e50', fontWeight: '600', margin: 0 }}>
                                {isEditing ? 'Edit Timetable' : 'Create New Timetable'} for {selectedClass} - Section {selectedSection}
                            </h3>
                            <div style={styles.createTimetableActions}>
                                <button
                                    style={{ ...styles.btn, ...styles.btnSave }}
                                    onClick={handleSaveTimetable}
                                    onMouseEnter={(e) => handleMouseEnter(e, styles.btnSaveHover)}
                                    onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnSave })}
                                >
                                    Save Timetable
                                </button>
                                <button
                                    style={{ ...styles.btn, ...styles.btnCancel }}
                                    onClick={handleCancelCreate}
                                    onMouseEnter={(e) => handleMouseEnter(e, styles.btnCancelHover)}
                                    onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnCancel })}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div style={styles.timetableFormContainer}>
                            <div style={styles.daysHeader}>
                                <div style={styles.periodLabel}>Period / Time</div>
                                {days.map(day => (
                                    <div key={day} style={styles.dayHeader}>{day}</div>
                                ))}
                            </div>

                            <div style={styles.timetableFormRows}>
                                {periods.map(period => (
                                    <div key={period.id} style={styles.timetableFormRow}>
                                        <div style={styles.periodTimeInfo}>
                                            <div style={styles.periodNumber}>Period {period.id}</div>
                                            <div style={styles.periodTimeRange}>{period.start} - {period.end}</div>
                                        </div>

                                        {days.map(day => {
                                            const periodIndex = period.id - 1;
                                            const cellData = newTimetable[day][periodIndex] || { subject: '', teacher: '', room: '' };

                                            return (
                                                <div key={`${day}-${period.id}`} style={styles.timetableFormCell}>
                                                    <select
                                                        value={cellData.subject}
                                                        onChange={(e) => handleTimetableChange(day, periodIndex, 'subject', e.target.value)}
                                                        style={styles.subjectSelect}
                                                        onFocus={(e) => Object.assign(e.target.style, styles.formSelectFocus)}
                                                        onBlur={(e) => { e.target.style.borderColor = '#ced4da'; e.target.style.boxShadow = 'none'; }}
                                                    >
                                                        <option value="">-- Select Subject --</option>
                                                        {subjects.map(subject => (
                                                            <option key={subject} value={subject}>{subject}</option>
                                                        ))}
                                                    </select>

                                                    <input
                                                        type="text"
                                                        placeholder="Teacher Name"
                                                        value={cellData.teacher}
                                                        onChange={(e) => handleTimetableChange(day, periodIndex, 'teacher', e.target.value)}
                                                        style={styles.teacherInput}
                                                        onFocus={(e) => Object.assign(e.target.style, styles.formSelectFocus)}
                                                        onBlur={(e) => { e.target.style.borderColor = '#ced4da'; e.target.style.boxShadow = 'none'; }}
                                                    />

                                                    <input
                                                        type="text"
                                                        placeholder="Room No."
                                                        value={cellData.room}
                                                        onChange={(e) => handleTimetableChange(day, periodIndex, 'room', e.target.value)}
                                                        style={styles.roomInput}
                                                        onFocus={(e) => Object.assign(e.target.style, styles.formSelectFocus)}
                                                        onBlur={(e) => { e.target.style.borderColor = '#ced4da'; e.target.style.boxShadow = 'none'; }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.formInstructions}>
                            <p style={{ margin: 0, color: '#2c3e50', fontSize: '14px' }}>
                                <strong>Instructions:</strong> Select a subject for each period, optionally add teacher name and room number. Leave blank for free periods.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Snackbar Notifications */}
            {snackbar.open && (
                <div style={styles.snackbarContainer}>
                    <div style={getSnackbarStyle()}>
                        <span style={styles.snackbarMessage}>{snackbar.message}</span>
                        <button
                            style={styles.snackbarClose}
                            onClick={() => setSnackbar({ ...snackbar, open: false })}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog.open && (
                <div style={styles.confirmationOverlay}>
                    <div style={styles.confirmationDialog}>
                        <h3 style={styles.confirmationTitle}>Confirm Action</h3>
                        <p style={styles.confirmationMessage}>{confirmDialog.message}</p>
                        <div style={styles.confirmationActions}>
                            <button
                                style={{ ...styles.btn, ...styles.btnCancelConfirm }}
                                onClick={closeConfirmation}
                                onMouseEnter={(e) => handleMouseEnter(e, styles.btnCancelConfirmHover)}
                                onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnCancelConfirm })}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ ...styles.btn, ...styles.btnConfirm }}
                                onClick={handleConfirm}
                                onMouseEnter={(e) => handleMouseEnter(e, styles.btnConfirmHover)}
                                onMouseLeave={(e) => handleMouseLeave(e, { ...styles.btn, ...styles.btnConfirm })}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimeTable;