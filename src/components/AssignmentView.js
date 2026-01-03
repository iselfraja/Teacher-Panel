// AssignmentView.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AssignmentView = () => {
    // State variables
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [showAllStudents, setShowAllStudents] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [checkedStudents, setCheckedStudents] = useState([]);
    const [studentDescriptions, setStudentDescriptions] = useState({});
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [assignmentsList, setAssignmentsList] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [viewingFile, setViewingFile] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Dialog states
    const [editStudentDialog, setEditStudentDialog] = useState(false);
    const [editAssignmentDialog, setEditAssignmentDialog] = useState(false);
    const [viewFileDialog, setViewFileDialog] = useState(false);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);

    // Data arrays
    const teachers = ['Select Teacher', 'ROSHNI', 'PRIYA', 'SUNITA', 'RAHUL', 'ANJALI'];
    const classes = ['Select Class', 'Nur', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const sections = ['Select Section', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const subjects = ['Select Subject', 'Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Art', 'Music', 'Physical Education'];

    // Sample students data - wrapped in useMemo to prevent unnecessary re-renders
    const studentsData = useMemo(() => [
        {
            admissionNo: 'ADM/2024/0020',
            student: 'AADVIK',
            subject: 'Hindi',
            class: 'Nur',
            section: 'A1',
            submittedFile: 'assignment1.pdf',
            submittedDate: '25/10/2025',
            description: 'Submitted on time',
            roll: '5',
            teacher: 'ROSHNI',
            assignmentId: 123,
            status: 'Submitted',
            grade: 'A',
            remarks: 'Good Job keep it up ok',
            fileUrl: 'https://example.com/assignment1.pdf'
        },
        {
            admissionNo: 'ADM/2024/1789',
            student: 'KRISHNA',
            subject: 'Hindi',
            class: 'Nur',
            section: 'A1',
            submittedFile: null,
            submittedDate: null,
            description: 'Not submitted',
            roll: 'Seat Excee',
            teacher: 'ROSHNI',
            assignmentId: 123,
            status: 'Not Submitted',
            grade: 'N/A',
            remarks: '',
            fileUrl: null
        },
        {
            admissionNo: 'ADM/2025/0179',
            student: 'Rayan Asad',
            subject: 'English',
            class: 'LKG',
            section: 'A2',
            submittedFile: 'assignment2.docx',
            submittedDate: '20/09/2025',
            description: 'Good work',
            roll: '2',
            teacher: 'PRIYA',
            assignmentId: 117,
            status: 'Submitted',
            grade: 'B+',
            remarks: 'Write a Letter',
            fileUrl: 'https://example.com/assignment2.docx'
        },
        {
            admissionNo: 'ADM/2025/0185',
            student: 'rani',
            subject: 'Mathematics',
            class: 'UKG',
            section: 'B1',
            submittedFile: null,
            submittedDate: null,
            description: 'Pending',
            roll: '3',
            teacher: 'SUNITA',
            assignmentId: 123,
            status: 'Not Submitted',
            grade: 'N/A',
            remarks: '',
            fileUrl: null
        },
        {
            admissionNo: 'ADM/2025/0190',
            student: 'samad',
            subject: 'Science',
            class: 'Class 1',
            section: 'B2',
            submittedFile: 'assignment3.pdf',
            submittedDate: '25/10/2025',
            description: 'Excellent',
            roll: '4',
            teacher: 'RAHUL',
            assignmentId: 117,
            status: 'Submitted',
            grade: 'A+',
            remarks: 'Excellent work',
            fileUrl: 'https://example.com/assignment3.pdf'
        },
    ], []);

    // Sample assignments data
    const initialAssignments = useMemo(() => [
        {
            id: 123,
            title: 'Hindi Assignment - Chapter 1',
            assignmentDate: '22/10/2025',
            subjectName: 'Hindi',
            submissionDate: '25/10/2025',
            description: 'Good Job keep it up ok',
            class: 'Nur',
            teacher: 'ROSHNI',
            totalStudents: 25,
            submittedCount: 20,
            pendingCount: 5,
            attachments: ['chapter1.pdf', 'instructions.docx'],
            maxMarks: 100,
            weightage: '10%'
        },
        {
            id: 117,
            title: 'English Essay Writing',
            assignmentDate: '08/09/2025',
            subjectName: 'English',
            submissionDate: '20/09/2025',
            description: 'Write a Letter',
            class: 'LKG',
            teacher: 'PRIYA',
            totalStudents: 30,
            submittedCount: 25,
            pendingCount: 5,
            attachments: ['essay_guidelines.pdf'],
            maxMarks: 50,
            weightage: '5%'
        }
    ], []);

    // Initialize assignments list
    useEffect(() => {
        setAssignmentsList(initialAssignments);
    }, [initialAssignments]);

    const assignments = ['Select Assignment', ...initialAssignments.map(assign =>
        `${assign.id} - ${assign.subjectName} (${assign.assignmentDate})`
    )];

    // Filter students based on selected criteria
    const filterStudents = useCallback(() => {
        let filtered = [...studentsData];

        // Filter by teacher
        if (selectedTeacher && selectedTeacher !== 'Select Teacher') {
            filtered = filtered.filter(student => student.teacher === selectedTeacher);
        }

        // Filter by class
        if (selectedClass && selectedClass !== 'Select Class') {
            filtered = filtered.filter(student => student.class === selectedClass);
        }

        // Filter by section
        if (selectedSection && selectedSection !== 'Select Section') {
            filtered = filtered.filter(student => student.section === selectedSection);
        }

        // Filter by subject
        if (selectedSubject && selectedSubject !== 'Select Subject') {
            filtered = filtered.filter(student => student.subject === selectedSubject);
        }

        // Filter by assignment
        if (selectedAssignment && selectedAssignment !== 'Select Assignment') {
            const assignmentId = parseInt(selectedAssignment.split(' - ')[0]);
            filtered = filtered.filter(student => student.assignmentId === assignmentId);
        }

        // Filter by submission status
        if (!showAllStudents) {
            filtered = filtered.filter(student => student.status === 'Submitted');
        }

        setFilteredStudents(filtered);
    }, [selectedTeacher, selectedClass, selectedSection, selectedSubject, selectedAssignment, showAllStudents, studentsData]);

    useEffect(() => {
        filterStudents();
    }, [filterStudents]);

    // Handle checkbox change
    const handleCheckboxChange = (admissionNo) => {
        if (checkedStudents.includes(admissionNo)) {
            setCheckedStudents(checkedStudents.filter(id => id !== admissionNo));
        } else {
            setCheckedStudents([...checkedStudents, admissionNo]);
        }
    };

    // Handle select all checkbox
    const handleSelectAll = () => {
        if (checkedStudents.length === filteredStudents.length) {
            setCheckedStudents([]);
        } else {
            setCheckedStudents(filteredStudents.map(student => student.admissionNo));
        }
    };

    // Handle description change
    const handleDescriptionChange = (admissionNo, value) => {
        setStudentDescriptions({
            ...studentDescriptions,
            [admissionNo]: value
        });
    };

    // Handle view file
    const handleViewFile = (student) => {
        if (!student.submittedFile) {
            setSnackbar({
                open: true,
                message: `No file submitted by ${student.student}`,
                severity: 'warning'
            });
            return;
        }

        setViewingFile(student);
        setViewFileDialog(true);
    };

    // Handle download file
    const handleDownloadFile = (student) => {
        if (!student.fileUrl) {
            setSnackbar({
                open: true,
                message: `No file available for download`,
                severity: 'warning'
            });
            return;
        }

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = student.fileUrl;
        link.download = student.submittedFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnackbar({
            open: true,
            message: `Downloading ${student.submittedFile}...`,
            severity: 'success'
        });
    };

    // Handle edit student
    const handleEditStudent = (student) => {
        setEditingStudent({ ...student });
        setEditStudentDialog(true);
    };

    // Handle save student edit
    const handleSaveStudentEdit = () => {
        if (editingStudent) {
            setSnackbar({
                open: true,
                message: `Updated details for ${editingStudent.student}`,
                severity: 'success'
            });
            // In real app, update student data in backend
            setEditStudentDialog(false);
            setEditingStudent(null);
        }
    };

    // Handle edit assignment
    const handleEditAssignment = () => {
        if (!selectedAssignment || selectedAssignment === 'Select Assignment') {
            setSnackbar({
                open: true,
                message: 'Please select an assignment to edit',
                severity: 'warning'
            });
            return;
        }

        const assignmentId = parseInt(selectedAssignment.split(' - ')[0]);
        const assignment = initialAssignments.find(a => a.id === assignmentId);
        if (assignment) {
            setEditingAssignment({ ...assignment });
            setEditAssignmentDialog(true);
        }
    };

    // Handle save assignment edit
    const handleSaveAssignmentEdit = () => {
        if (editingAssignment) {
            setSnackbar({
                open: true,
                message: `Updated assignment ${editingAssignment.id}`,
                severity: 'success'
            });
            // In real app, update assignment in backend
            setEditAssignmentDialog(false);
            setEditingAssignment(null);
        }
    };

    // Handle delete assignment
    const handleDeleteAssignment = () => {
        if (!selectedAssignment || selectedAssignment === 'Select Assignment') {
            setSnackbar({
                open: true,
                message: 'Please select an assignment to delete',
                severity: 'warning'
            });
            return;
        }

        const assignmentId = parseInt(selectedAssignment.split(' - ')[0]);
        const assignment = initialAssignments.find(a => a.id === assignmentId);
        if (assignment) {
            setAssignmentToDelete(assignment);
            setDeleteConfirmDialog(true);
        }
    };

    // Confirm delete assignment
    const confirmDeleteAssignment = () => {
        if (assignmentToDelete) {
            // Remove assignment from list
            const updatedAssignments = assignmentsList.filter(a => a.id !== assignmentToDelete.id);
            setAssignmentsList(updatedAssignments);

            setSnackbar({
                open: true,
                message: `Assignment ${assignmentToDelete.id} has been deleted`,
                severity: 'success'
            });

            // Reset selection
            setSelectedAssignment('');
            setDeleteConfirmDialog(false);
            setAssignmentToDelete(null);
        }
    };

    // Handle save (bulk update)
    const handleSave = () => {
        const selectedCount = checkedStudents.length;

        if (selectedCount === 0) {
            setSnackbar({
                open: true,
                message: 'Please select at least one student to save changes',
                severity: 'warning'
            });
            return;
        }

        // Save descriptions for selected students
        const savedDescriptions = checkedStudents.map(admissionNo => ({
            admissionNo,
            description: studentDescriptions[admissionNo] || ''
        }));

        console.log('Saved descriptions:', savedDescriptions);

        setSnackbar({
            open: true,
            message: `Successfully saved changes for ${selectedCount} student(s)!`,
            severity: 'success'
        });

        // Reset checkboxes after save
        setCheckedStudents([]);
    };

    // Handle reset
    const handleReset = () => {
        setSelectedTeacher('');
        setSelectedClass('');
        setSelectedSection('');
        setSelectedSubject('');
        setSelectedAssignment('');
        setShowAllStudents(true);
        setCheckedStudents([]);
        setStudentDescriptions({});

        setSnackbar({
            open: true,
            message: 'All filters and selections have been reset',
            severity: 'info'
        });
    };

    // Handle view assignment details
    const handleViewAssignmentDetails = () => {
        if (!selectedAssignment || selectedAssignment === 'Select Assignment') {
            setSnackbar({
                open: true,
                message: 'Please select an assignment to view details',
                severity: 'warning'
            });
            return;
        }

        const assignmentId = parseInt(selectedAssignment.split(' - ')[0]);
        const assignment = initialAssignments.find(a => a.id === assignmentId);
        if (assignment) {
            setEditingAssignment({ ...assignment });
            setEditAssignmentDialog(true);
        }
    };

    // Handle update student status
    const handleUpdateStatus = (admissionNo, status) => {
        const student = studentsData.find(s => s.admissionNo === admissionNo);
        if (student) {
            setSnackbar({
                open: true,
                message: `Updated status for ${student.student} to ${status}`,
                severity: 'success'
            });
            // In real app, update status in backend
        }
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Check if any filter is selected
    const isAnyFilterSelected = () => {
        const hasTeacherFilter = (selectedTeacher !== '') && (selectedTeacher !== 'Select Teacher');
        const hasClassFilter = (selectedClass !== '') && (selectedClass !== 'Select Class');
        const hasSectionFilter = (selectedSection !== '') && (selectedSection !== 'Select Section');
        const hasSubjectFilter = (selectedSubject !== '') && (selectedSubject !== 'Select Subject');
        const hasAssignmentFilter = (selectedAssignment !== '') && (selectedAssignment !== 'Select Assignment');

        return hasTeacherFilter || hasClassFilter || hasSectionFilter || hasSubjectFilter || hasAssignmentFilter;
    };

    // Get status badge style
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'Submitted':
                return {
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                };
            case 'Not Submitted':
                return {
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                };
            default:
                return {
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                };
        }
    };

    // Styles
    const containerStyle = {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        minHeight: '600px'
    };

    const titleStyle = {
        color: '#2c3e50',
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '20px',
        borderBottom: '2px solid #4a6ee0',
        paddingBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const filterContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '25px',
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
    };

    const filterGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const filterLabelStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '5px'
    };

    const selectStyle = {
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        backgroundColor: 'white',
        width: '100%',
        cursor: 'pointer',
        transition: 'border-color 0.3s'
    };

    const tableContainerStyle = {
        overflowX: 'auto',
        marginTop: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        maxHeight: '400px',
        overflowY: 'auto'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        minWidth: '1000px'
    };

    const thStyle = {
        backgroundColor: '#f3f4f6',
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#374151',
        borderBottom: '2px solid #e5e7eb',
        whiteSpace: 'nowrap',
        position: 'sticky',
        top: 0,
        zIndex: 10
    };

    const tdStyle = {
        padding: '12px 15px',
        borderBottom: '1px solid #f3f4f6',
        color: '#6b7280'
    };

    const checkboxStyle = {
        width: '16px',
        height: '16px',
        cursor: 'pointer'
    };

    const toggleContainerStyle = {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
    };

    const toggleButtonStyle = (isActive) => ({
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: isActive ? '#4a6ee0' : '#e5e7eb',
        color: isActive ? 'white' : '#6b7280',
        transition: 'all 0.3s'
    });

    const actionButtonStyle = {
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginRight: '10px',
        transition: 'all 0.3s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
    };

    const iconButtonStyle = {
        padding: '6px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '5px',
        transition: 'all 0.3s'
    };

    const viewButtonStyle = {
        backgroundColor: '#3b82f6',
        color: 'white'
    };

    const editButtonStyle = {
        backgroundColor: '#f59e0b',
        color: 'white'
    };

    const deleteButtonStyle = {
        backgroundColor: '#ef4444',
        color: 'white'
    };

    const saveButtonStyle = {
        backgroundColor: '#10b981',
        color: 'white'
    };

    const resetButtonStyle = {
        backgroundColor: '#6b7280',
        color: 'white'
    };

    const detailsButtonStyle = {
        backgroundColor: '#8b5cf6',
        color: 'white'
    };

    const buttonGroupStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        flexWrap: 'wrap'
    };

    const sectionTitleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        margin: '30px 0 15px 0',
        paddingBottom: '10px',
        borderBottom: '1px solid #e5e7eb'
    };

    const emptyStateStyle = {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#6b7280',
        fontStyle: 'italic'
    };

    const filterIndicatorStyle = {
        backgroundColor: '#4a6ee0',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        marginLeft: '10px'
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>
                View Assignments
                {isAnyFilterSelected() && (
                    <span style={filterIndicatorStyle}>
                        {filteredStudents.length} student(s) found
                    </span>
                )}
            </h2>

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
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Dialogs */}
            {/* Edit Student Dialog */}
            <Dialog open={editStudentDialog} onClose={() => setEditStudentDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Student Submission</DialogTitle>
                <DialogContent>
                    {editingStudent && (
                        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <TextField
                                    label="Student Name"
                                    value={editingStudent.student}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, student: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Admission No"
                                    value={editingStudent.admissionNo}
                                    disabled
                                    fullWidth
                                    margin="normal"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <TextField
                                    label="Class"
                                    value={editingStudent.class}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Section"
                                    value={editingStudent.section}
                                    fullWidth
                                    margin="normal"
                                />
                            </div>
                            <TextField
                                label="Status"
                                select
                                value={editingStudent.status}
                                onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="Submitted">Submitted</MenuItem>
                                <MenuItem value="Not Submitted">Not Submitted</MenuItem>
                                <MenuItem value="Late Submission">Late Submission</MenuItem>
                            </TextField>
                            <TextField
                                label="Grade"
                                value={editingStudent.grade}
                                onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Remarks"
                                value={editingStudent.remarks}
                                onChange={(e) => setEditingStudent({ ...editingStudent, remarks: e.target.value })}
                                multiline
                                rows={3}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditStudentDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveStudentEdit} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Assignment Dialog */}
            <Dialog open={editAssignmentDialog} onClose={() => setEditAssignmentDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Assignment Details</DialogTitle>
                <DialogContent>
                    {editingAssignment && (
                        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <TextField
                                label="Assignment Title"
                                value={editingAssignment.title}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <TextField
                                    label="Assignment Date"
                                    type="date"
                                    value={editingAssignment.assignmentDate}
                                    onChange={(e) => setEditingAssignment({ ...editingAssignment, assignmentDate: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Submission Date"
                                    type="date"
                                    value={editingAssignment.submissionDate}
                                    onChange={(e) => setEditingAssignment({ ...editingAssignment, submissionDate: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>
                            <TextField
                                label="Subject"
                                select
                                value={editingAssignment.subjectName}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, subjectName: e.target.value })}
                                fullWidth
                                margin="normal"
                            >
                                {subjects.slice(1).map(subject => (
                                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Class"
                                select
                                value={editingAssignment.class}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, class: e.target.value })}
                                fullWidth
                                margin="normal"
                            >
                                {classes.slice(1).map(cls => (
                                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Description"
                                value={editingAssignment.description}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                                multiline
                                rows={3}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Maximum Marks"
                                type="number"
                                value={editingAssignment.maxMarks}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, maxMarks: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditAssignmentDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveAssignmentEdit} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* View File Dialog */}
            <Dialog open={viewFileDialog} onClose={() => setViewFileDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>View Submitted File</DialogTitle>
                <DialogContent>
                    {viewingFile && (
                        <div style={{ padding: '20px 0', textAlign: 'center' }}>
                            <div style={{
                                backgroundColor: '#f3f4f6',
                                padding: '40px',
                                borderRadius: '8px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                                    📄
                                </div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>
                                    {viewingFile.submittedFile}
                                </h3>
                                <p style={{ color: '#6b7280', margin: '0' }}>
                                    Submitted by: {viewingFile.student}
                                </p>
                                <p style={{ color: '#6b7280', margin: '5px 0' }}>
                                    Submitted on: {viewingFile.submittedDate}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => window.open(viewingFile.fileUrl, '_blank')}
                                >
                                    View Online
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => handleDownloadFile(viewingFile)}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewFileDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    {assignmentToDelete && (
                        <div style={{ padding: '20px 0' }}>
                            <p>Are you sure you want to delete the following assignment?</p>
                            <div style={{
                                backgroundColor: '#fef2f2',
                                padding: '15px',
                                borderRadius: '8px',
                                marginTop: '10px'
                            }}>
                                <p style={{ margin: '0', fontWeight: '600' }}>
                                    {assignmentToDelete.title}
                                </p>
                                <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
                                    {assignmentToDelete.subjectName} - {assignmentToDelete.class}
                                </p>
                            </div>
                            <p style={{ marginTop: '15px', color: '#ef4444' }}>
                                This action cannot be undone.
                            </p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteAssignment} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student Submissions section */}
            <div>
                <h3 style={sectionTitleStyle}>Student Submissions</h3>

                <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Teacher</label>
                        <select
                            style={selectStyle}
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                        >
                            {teachers.map(teacher => (
                                <option key={teacher} value={teacher}>{teacher}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Class</label>
                        <select
                            style={selectStyle}
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Section</label>
                        <select
                            style={selectStyle}
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            {sections.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Subject</label>
                        <select
                            style={selectStyle}
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            {subjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Assignment</label>
                        <select
                            style={selectStyle}
                            value={selectedAssignment}
                            onChange={(e) => setSelectedAssignment(e.target.value)}
                        >
                            {assignments.map(assign => (
                                <option key={assign} value={assign}>{assign}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={toggleContainerStyle}>
                    <button
                        style={toggleButtonStyle(showAllStudents)}
                        onClick={() => setShowAllStudents(true)}
                    >
                        Show All Students
                    </button>
                    <button
                        style={toggleButtonStyle(!showAllStudents)}
                        onClick={() => setShowAllStudents(false)}
                    >
                        Show Submitted Only
                    </button>

                    {selectedAssignment && selectedAssignment !== 'Select Assignment' && (
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                                style={{ ...actionButtonStyle, ...detailsButtonStyle }}
                                onClick={handleViewAssignmentDetails}
                            >
                                👁️ View Details
                            </button>
                            <button
                                style={{ ...actionButtonStyle, ...editButtonStyle }}
                                onClick={handleEditAssignment}
                            >
                                ✏️ Edit Assignment
                            </button>
                            <button
                                style={{ ...actionButtonStyle, ...deleteButtonStyle }}
                                onClick={handleDeleteAssignment}
                            >
                                🗑️ Delete Assignment
                            </button>
                        </div>
                    )}
                </div>

                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>
                                    <input
                                        type="checkbox"
                                        style={checkboxStyle}
                                        checked={filteredStudents.length > 0 && checkedStudents.length === filteredStudents.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th style={thStyle}>Admission No</th>
                                <th style={thStyle}>Student</th>
                                <th style={thStyle}>Subject</th>
                                <th style={thStyle}>Class</th>
                                <th style={thStyle}>Section</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Submitted File</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Grade</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={index} style={{
                                        backgroundColor: checkedStudents.includes(student.admissionNo) ? '#f0f9ff' : 'transparent',
                                        transition: 'background-color 0.3s'
                                    }}>
                                        <td style={tdStyle}>
                                            <input
                                                type="checkbox"
                                                style={checkboxStyle}
                                                checked={checkedStudents.includes(student.admissionNo)}
                                                onChange={() => handleCheckboxChange(student.admissionNo)}
                                            />
                                        </td>
                                        <td style={tdStyle}>{student.admissionNo}</td>
                                        <td style={tdStyle}>{student.student}</td>
                                        <td style={tdStyle}>{student.subject}</td>
                                        <td style={tdStyle}>{student.class}</td>
                                        <td style={tdStyle}>{student.section}</td>
                                        <td style={tdStyle}>
                                            <span style={getStatusBadgeStyle(student.status)}>
                                                {student.status === 'Submitted' && <CheckCircleIcon style={{ fontSize: '14px' }} />}
                                                {student.status === 'Not Submitted' && <CancelIcon style={{ fontSize: '14px' }} />}
                                                {student.status}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            {student.submittedFile ? (
                                                <span style={{ fontSize: '12px', color: '#374151' }}>
                                                    📄 {student.submittedFile}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No file</span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <input
                                                type="text"
                                                value={studentDescriptions[student.admissionNo] || student.description}
                                                onChange={(e) => handleDescriptionChange(student.admissionNo, e.target.value)}
                                                style={{
                                                    padding: '6px 10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    width: '100%',
                                                    backgroundColor: checkedStudents.includes(student.admissionNo) ? '#ffffff' : '#f9fafb'
                                                }}
                                            />
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                backgroundColor: student.grade === 'A+' ? '#10b981' :
                                                    student.grade === 'A' ? '#34d399' :
                                                        student.grade === 'B+' ? '#fbbf24' : '#6b7280',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button
                                                    style={{ ...iconButtonStyle, ...editButtonStyle }}
                                                    onClick={() => handleEditStudent(student)}
                                                    title="Edit Student"
                                                >
                                                    <EditIcon style={{ fontSize: '16px' }} />
                                                </button>
                                                <button
                                                    style={{ ...iconButtonStyle, ...viewButtonStyle }}
                                                    onClick={() => handleViewFile(student)}
                                                    title="View File"
                                                >
                                                    <VisibilityIcon style={{ fontSize: '16px' }} />
                                                </button>
                                                {student.status === 'Not Submitted' && (
                                                    <button
                                                        style={{ ...iconButtonStyle, ...saveButtonStyle }}
                                                        onClick={() => handleUpdateStatus(student.admissionNo, 'Submitted')}
                                                        title="Mark as Submitted"
                                                    >
                                                        <CheckCircleIcon style={{ fontSize: '16px' }} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" style={emptyStateStyle}>
                                        {isAnyFilterSelected()
                                            ? 'No students found matching your filters. Try adjusting your selection criteria.'
                                            : 'Select filters to view student submissions.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                        <span style={{ color: '#0369a1', fontWeight: '500' }}>
                            {checkedStudents.length} of {filteredStudents.length} student(s) selected
                        </span>
                    </div>
                )}

                <div style={buttonGroupStyle}>
                    <button
                        onClick={handleSave}
                        style={{
                            ...actionButtonStyle,
                            ...saveButtonStyle,
                            opacity: checkedStudents.length === 0 ? 0.5 : 1,
                            cursor: checkedStudents.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                        disabled={checkedStudents.length === 0}
                    >
                        💾 Save Changes ({checkedStudents.length})
                    </button>
                    <button
                        onClick={handleReset}
                        style={{ ...actionButtonStyle, ...resetButtonStyle }}
                    >
                        🔄 Reset All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentView;