import React, { useState } from 'react';

const Examination = () => {
    const [formData, setFormData] = useState({
        examType: '',
        subExam: '',
        teacher: '',
        class: '',
        section: '',
        subject: ''
    });

    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState({});
    const [marksData, setMarksData] = useState({});
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const examTypes = ['Unit Test', 'Mid-Term', 'Final Exam', 'Quiz', 'Practical'];
    const subExams = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science'];
    const teachers = ['Mr. Smith', 'Ms. Johnson', 'Dr. Williams', 'Mr. Brown', 'Ms. Davis'];
    const classes = ['8th', '9th', '10th', '11th', '12th', 'Nur'];
    const sections = ['A', 'B', 'C', 'D', 'A1'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Hindi'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(query) ||
                student.rollNo.toLowerCase().includes(query) ||
                student.class.toLowerCase().includes(query)
            );
            setFilteredStudents(filtered);
        }
    };

    const handleGetStudents = () => {
        if (!formData.class || !formData.section || !formData.subject) {
            showSnackbar('Please select Class, Section, and Subject first', 'error');
            return;
        }

        // Mock student data with marks fields
        const mockStudents = [
            {
                id: 1,
                name: 'John Doe',
                rollNo: '101',
                class: formData.class,
                section: formData.section,
                subject: formData.subject,
                maxMarks: 40,
                minMarks: 10,
                obtainedMark: ''
            },
            {
                id: 2,
                name: 'Jane Smith',
                rollNo: '102',
                class: formData.class,
                section: formData.section,
                subject: formData.subject,
                maxMarks: 40,
                minMarks: 10,
                obtainedMark: ''
            },
            {
                id: 3,
                name: 'Robert Johnson',
                rollNo: '103',
                class: formData.class,
                section: formData.section,
                subject: formData.subject,
                maxMarks: 40,
                minMarks: 10,
                obtainedMark: ''
            },
            {
                id: 4,
                name: 'Emily Davis',
                rollNo: '104',
                class: formData.class,
                section: formData.section,
                subject: formData.subject,
                maxMarks: 40,
                minMarks: 10,
                obtainedMark: ''
            },
            {
                id: 5,
                name: 'Michael Wilson',
                rollNo: '105',
                class: formData.class,
                section: formData.section,
                subject: formData.subject,
                maxMarks: 40,
                minMarks: 10,
                obtainedMark: ''
            },
        ];

        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
        setSelectedStudents({});
        setMarksData({});
        showSnackbar(`Found ${mockStudents.length} students for ${formData.class}${formData.section} - ${formData.subject}`, 'success');
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const handleMarkChange = (studentId, value) => {
        // Validate mark is within range
        const student = students.find(s => s.id === studentId);
        if (student) {
            const numValue = parseInt(value);
            if (numValue > student.maxMarks) {
                showSnackbar(`Marks cannot exceed ${student.maxMarks}`, 'error');
                return;
            }
        }

        setMarksData(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSaveMarks = () => {
        // Check if any student is selected
        const selectedCount = Object.values(selectedStudents).filter(val => val).length;
        if (selectedCount === 0) {
            showSnackbar('Please select at least one student to save marks', 'error');
            return;
        }

        // Validate all selected students have marks
        const errors = [];
        Object.keys(selectedStudents).forEach(studentId => {
            if (selectedStudents[studentId]) {
                const studentIdNum = parseInt(studentId);
                const mark = marksData[studentIdNum];
                const student = students.find(s => s.id === studentIdNum);

                if (!mark || mark === '') {
                    errors.push(`${student.name} (Roll No: ${student.rollNo})`);
                } else if (parseInt(mark) < student.minMarks) {
                    errors.push(`${student.name} - Marks below minimum (${student.minMarks})`);
                }
            }
        });

        if (errors.length > 0) {
            showSnackbar(`Please enter valid marks for: ${errors.join(', ')}`, 'error');
            return;
        }

        // Save marks - in real app, this would be an API call
        const updatedStudents = students.map(student => {
            if (selectedStudents[student.id] && marksData[student.id]) {
                return {
                    ...student,
                    obtainedMark: marksData[student.id]
                };
            }
            return student;
        });

        setStudents(updatedStudents);
        showSnackbar(`Marks saved successfully for ${selectedCount} student(s)`, 'success');

        // Clear selections after save
        setSelectedStudents({});
    };

    const handleCancel = () => {
        setFormData({
            examType: '',
            subExam: '',
            teacher: '',
            class: '',
            section: '',
            subject: ''
        });
        setStudents([]);
        setFilteredStudents([]);
        setSelectedStudents({});
        setMarksData({});
        setSearchQuery('');
        showSnackbar('All selections have been cleared', 'success');
    };

    const showSnackbar = (message, type) => {
        setSnackbar({
            show: true,
            message,
            type
        });

        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, show: false }));
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Examination Details</h2>

            <div style={formContainerStyle}>
                {/* Exam Type Section */}
                <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Exam Type:</h3>
                    <div style={rowStyle}>
                        <div style={selectGroupStyle}>
                            <label style={labelStyle}>Select Exam Type</label>
                            <select
                                name="examType"
                                value={formData.examType}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="">Select Exam Type</option>
                                {examTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div style={selectGroupStyle}>
                            <label style={labelStyle}>Sub Exam</label>
                            <select
                                name="subExam"
                                value={formData.subExam}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="">Select Sub Exam</option>
                                {subExams.map(exam => (
                                    <option key={exam} value={exam}>{exam}</option>
                                ))}
                            </select>
                        </div>

                        <div style={selectGroupStyle}>
                            <label style={labelStyle}>Teacher</label>
                            <select
                                name="teacher"
                                value={formData.teacher}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher} value={teacher}>{teacher}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Class Section */}
                <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Class:</h3>
                    <div style={rowStyle}>
                        <div style={selectGroupStyle}>
                            <label style={labelStyle}>Select Class</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="">Select Class</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        <div style={selectGroupStyle}>
                            <label style={labelStyle}>Section</label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="">Select Section</option>
                                {sections.map(section => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
                            </select>
                        </div>

                        <div style={selectGroupStyle}>
                            <label style={labelStyle}>Subject</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={actionButtonsStyle}>
                    <button
                        onClick={handleGetStudents}
                        style={getStudentsButtonStyle}
                    >
                        GET STUDENT
                    </button>
                    <button
                        onClick={handleCancel}
                        style={cancelButtonStyle}
                    >
                        CANCEL
                    </button>
                </div>

                {/* Students List */}
                {students.length > 0 && (
                    <div style={studentsContainerStyle}>
                        <h3 style={studentsTitleStyle}>Student List</h3>

                        {/* Search Bar */}
                        <div style={searchContainerStyle}>
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={searchInputStyle}
                            />
                        </div>

                        {/* Students Table */}
                        <div style={studentsTableContainer}>
                            <div style={tableHeaderStyle}>
                                <div style={{ ...tableCellStyle, width: '60px', textAlign: 'center' }}>Select</div>
                                <div style={{ ...tableCellStyle, width: '120px' }}>Name</div>
                                <div style={{ ...tableCellStyle, width: '100px' }}>Roll No</div>
                                <div style={{ ...tableCellStyle, width: '80px' }}>Class</div>
                                <div style={{ ...tableCellStyle, width: '80px' }}>Section</div>
                                <div style={{ ...tableCellStyle, width: '120px' }}>Subject</div>
                                <div style={{ ...tableCellStyle, width: '100px' }}>Max Marks</div>
                                <div style={{ ...tableCellStyle, width: '100px' }}>Min Marks</div>
                                <div style={{ ...tableCellStyle, width: '120px' }}>Obtained Mark</div>
                            </div>

                            {filteredStudents.map(student => (
                                <div key={student.id} style={tableRowStyle}>
                                    <div style={{ ...tableCellStyle, width: '60px', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={!!selectedStudents[student.id]}
                                            onChange={() => handleSelectStudent(student.id)}
                                            style={checkboxStyle}
                                        />
                                    </div>
                                    <div style={{ ...tableCellStyle, width: '120px' }}>{student.name}</div>
                                    <div style={{ ...tableCellStyle, width: '100px' }}>{student.rollNo}</div>
                                    <div style={{ ...tableCellStyle, width: '80px' }}>{student.class}</div>
                                    <div style={{ ...tableCellStyle, width: '80px' }}>{student.section}</div>
                                    <div style={{ ...tableCellStyle, width: '120px' }}>{student.subject}</div>
                                    <div style={{ ...tableCellStyle, width: '100px' }}>{student.maxMarks}</div>
                                    <div style={{ ...tableCellStyle, width: '100px' }}>{student.minMarks}</div>
                                    <div style={{ ...tableCellStyle, width: '120px' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            max={student.maxMarks}
                                            value={marksData[student.id] || student.obtainedMark || ''}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            disabled={!selectedStudents[student.id]}
                                            style={markInputStyle(selectedStudents[student.id])}
                                            placeholder="Enter marks"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save/Cancel Buttons */}
                        {students.length > 0 && (
                            <div style={saveCancelButtonsStyle}>
                                <button
                                    onClick={handleSaveMarks}
                                    style={saveButtonStyle}
                                >
                                    SAVE
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedStudents({});
                                        setMarksData({});
                                        showSnackbar('Marks entry cleared', 'info');
                                    }}
                                    style={cancelMarksButtonStyle}
                                >
                                    CANCEL
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Removed Selected Details Preview Section */}
            </div>

            {/* Snackbar Notification */}
            {snackbar.show && (
                <div style={snackbarStyle(snackbar.type)}>
                    <div style={snackbarContentStyle}>
                        <span style={snackbarMessageStyle}>{snackbar.message}</span>
                        <button onClick={closeSnackbar} style={snackbarCloseButtonStyle}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles
const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    position: 'relative'
};

const titleStyle = {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #4a6ee0',
    fontSize: '24px'
};

const formContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '8px'
};

const sectionStyle = {
    marginBottom: '30px'
};

const sectionTitleStyle = {
    color: '#2c3e50',
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600'
};

const rowStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
};

const selectGroupStyle = {
    flex: '1',
    minWidth: '250px'
};

const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px'
};

const selectStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
};

const actionButtonsStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '40px',
    marginBottom: '30px'
};

const getStudentsButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    minWidth: '200px',
    transition: 'background-color 0.3s',
    ':hover': {
        backgroundColor: '#3a5ecf'
    }
};

const cancelButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    minWidth: '200px',
    transition: 'background-color 0.3s',
    ':hover': {
        backgroundColor: '#d62c1a'
    }
};

const studentsContainerStyle = {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e1e8ed'
};

const studentsTitleStyle = {
    color: '#2c3e50',
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600'
};

const searchContainerStyle = {
    marginBottom: '20px'
};

const searchInputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    ':focus': {
        outline: 'none',
        borderColor: '#4a6ee0',
        boxShadow: '0 0 0 2px rgba(74, 110, 224, 0.1)'
    }
};

const studentsTableContainer = {
    border: '1px solid #e1e8ed',
    borderRadius: '6px',
    overflow: 'hidden',
    overflowX: 'auto',
    marginBottom: '20px'
};

const tableHeaderStyle = {
    display: 'flex',
    backgroundColor: '#4a6ee0',
    color: 'white',
    padding: '15px 0',
    minWidth: '1000px'
};

const tableRowStyle = {
    display: 'flex',
    padding: '15px 0',
    borderBottom: '1px solid #e1e8ed',
    backgroundColor: 'white',
    minWidth: '1000px',
    ':hover': {
        backgroundColor: '#f8f9fa'
    }
};

const tableCellStyle = {
    padding: '5px 15px',
    fontSize: '14px',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center'
};

const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
};

const markInputStyle = (isSelected) => ({
    width: '100%',
    padding: '8px 10px',
    borderRadius: '4px',
    border: `1px solid ${isSelected ? '#4a6ee0' : '#ddd'}`,
    fontSize: '14px',
    backgroundColor: isSelected ? 'white' : '#f5f5f5',
    boxSizing: 'border-box',
    ':focus': {
        outline: 'none',
        borderColor: '#4a6ee0',
        boxShadow: '0 0 0 2px rgba(74, 110, 224, 0.1)'
    }
});

const saveCancelButtonsStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'flex-end',
    marginTop: '20px'
};

const saveButtonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '120px',
    transition: 'background-color 0.3s',
    ':hover': {
        backgroundColor: '#219653'
    }
};

const cancelMarksButtonStyle = {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '120px',
    transition: 'background-color 0.3s',
    ':hover': {
        backgroundColor: '#7f8c8d'
    }
};

// Snackbar Styles
const snackbarStyle = (type) => ({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#3498db',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    minWidth: '300px',
    maxWidth: '400px',
    animation: 'slideIn 0.3s ease-out'
});

const snackbarContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px'
};

const snackbarMessageStyle = {
    fontSize: '14px',
    flex: 1
};

const snackbarCloseButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    }
};

// Add CSS animation
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
    
    /* Add responsive styles */
    @media (max-width: 1200px) {
        .table-responsive {
            overflow-x: auto;
        }
    }
`;
document.head.appendChild(style);

export default Examination;