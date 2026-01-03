import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('10th A');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [attendanceData, setAttendanceData] = useState([
        { id: 1, admissionNo: '2023001', firstName: 'Rahul', lastName: 'Sharma', rollNo: '101', stream: 'Science', status: 'present' },
        { id: 2, admissionNo: '2023002', firstName: 'Priya', lastName: 'Patel', rollNo: '102', stream: 'Commerce', status: 'present' },
        { id: 3, admissionNo: '2023003', firstName: 'Amit', lastName: 'Kumar', rollNo: '103', stream: 'Science', status: 'absent' },
        { id: 4, admissionNo: '2023004', firstName: 'Sneha', lastName: 'Singh', rollNo: '104', stream: 'Arts', status: 'present' },
        { id: 5, admissionNo: '2023005', firstName: 'Rohan', lastName: 'Gupta', rollNo: '105', stream: 'Science', status: 'late' },
        { id: 6, admissionNo: '2023006', firstName: 'Neha', lastName: 'Verma', rollNo: '106', stream: 'Commerce', status: 'present' },
        { id: 7, admissionNo: '2023007', firstName: 'Vikram', lastName: 'Yadav', rollNo: '107', stream: 'Arts', status: 'absent' },
    ]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const classes = ['10th A', '10th B', '9th A', '9th B', '8th A', '8th B'];
    const teachers = ['Mr. Sharma', 'Ms. Patel', 'Mr. Verma', 'Ms. Singh'];
    const streams = ['Science', 'Commerce', 'Arts'];

    const handleStatusChange = (id, status) => {
        setAttendanceData(attendanceData.map(student =>
            student.id === id ? { ...student, status } : student
        ));
        showSnackbar(`Attendance marked for student ID: ${id}`, 'success');
    };

    const handleMarkAll = (status) => {
        setAttendanceData(attendanceData.map(student => ({ ...student, status })));
        showSnackbar(`All students marked as ${status.toUpperCase()}`, 'info');
    };

    const handleSaveAttendance = () => {
        if (!selectedTeacher) {
            showSnackbar('Please select a teacher first!', 'warning');
            return;
        }

        const presentCount = attendanceData.filter(s => s.status === 'present').length;
        const absentCount = attendanceData.filter(s => s.status === 'absent').length;
        const lateCount = attendanceData.filter(s => s.status === 'late').length;

        showSnackbar(
            `Attendance saved successfully!\nClass: ${selectedClass}\nDate: ${selectedDate}\n\nPresent: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}, Total: ${attendanceData.length}`,
            'success'
        );
    };

    const handleAddAttendance = () => {
        showSnackbar('Add Attendance feature clicked!', 'info');
    };

    const calculateStats = () => {
        const present = attendanceData.filter(s => s.status === 'present').length;
        const absent = attendanceData.filter(s => s.status === 'absent').length;
        const late = attendanceData.filter(s => s.status === 'late').length;
        const total = attendanceData.length;
        const percentage = total > 0 ? ((present + late * 0.5) / total * 100).toFixed(1) : 0;

        return { present, absent, late, total, percentage };
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const stats = calculateStats();

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return '#2ecc71';
            case 'absent': return '#e74c3c';
            case 'late': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    // Filter data based on selected stream
    const filteredData = selectedStream
        ? attendanceData.filter(student => student.stream === selectedStream)
        : attendanceData;

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Student Attendance</h2>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%', whiteSpace: 'pre-line' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Filters as per the image */}
            <div style={filtersContainerStyle}>
                <div style={filterRowStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Teacher</label>
                        <select
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="">-- Select Teacher --</option>
                            {teachers.map(teacher => (
                                <option key={teacher} value={teacher}>{teacher}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            style={selectStyle}
                        >
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Stream</label>
                        <select
                            value={selectedStream}
                            onChange={(e) => setSelectedStream(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="">-- All Streams --</option>
                            {streams.map(stream => (
                                <option key={stream} value={stream}>{stream}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleAddAttendance} style={addButtonStyle}>
                        Add Attendance
                    </button>
                </div>

                <div style={filterRowStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={dateInputStyle}
                        />
                    </div>

                    <button onClick={handleSaveAttendance} style={saveButtonStyle}>
                        Save Attendance
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={quickActionsStyle}>
                <span style={actionLabelStyle}>Mark All:</span>
                <button
                    onClick={() => handleMarkAll('present')}
                    style={{ ...actionButtonStyle, backgroundColor: '#2ecc71' }}
                >
                    Present
                </button>
                <button
                    onClick={() => handleMarkAll('absent')}
                    style={{ ...actionButtonStyle, backgroundColor: '#e74c3c' }}
                >
                    Absent
                </button>
                <button
                    onClick={() => handleMarkAll('late')}
                    style={{ ...actionButtonStyle, backgroundColor: '#f39c12' }}
                >
                    Late
                </button>
            </div>

            {/* Attendance Table - Matching the image structure */}
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Serial No</th>
                            <th style={thStyle}>Admission No</th>
                            <th style={thStyle}>First Name</th>
                            <th style={thStyle}>Last Name</th>
                            <th style={thStyle}>Roll No</th>
                            <th style={thStyle}>Stream</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((student, index) => (
                                <tr key={student.id} style={dataRowStyle}>
                                    <td style={tdStyle}>{index + 1}</td>
                                    <td style={tdStyle}>{student.admissionNo}</td>
                                    <td style={tdStyle}>{student.firstName}</td>
                                    <td style={tdStyle}>{student.lastName}</td>
                                    <td style={tdStyle}>{student.rollNo}</td>
                                    <td style={tdStyle}>{student.stream}</td>
                                    <td style={tdStyle}>
                                        <div style={actionButtonsContainer}>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'present')}
                                                style={{
                                                    ...statusButtonStyle,
                                                    backgroundColor: student.status === 'present' ? '#2ecc71' : '#ecf0f1',
                                                    color: student.status === 'present' ? 'white' : '#2c3e50',
                                                    border: student.status === 'present' ? 'none' : '1px solid #bdc3c7'
                                                }}
                                                title="Mark Present"
                                            >
                                                P
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                style={{
                                                    ...statusButtonStyle,
                                                    backgroundColor: student.status === 'absent' ? '#e74c3c' : '#ecf0f1',
                                                    color: student.status === 'absent' ? 'white' : '#2c3e50',
                                                    border: student.status === 'absent' ? 'none' : '1px solid #bdc3c7'
                                                }}
                                                title="Mark Absent"
                                            >
                                                A
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'late')}
                                                style={{
                                                    ...statusButtonStyle,
                                                    backgroundColor: student.status === 'late' ? '#f39c12' : '#ecf0f1',
                                                    color: student.status === 'late' ? 'white' : '#2c3e50',
                                                    border: student.status === 'late' ? 'none' : '1px solid #bdc3c7'
                                                }}
                                                title="Mark Late"
                                            >
                                                L
                                            </button>
                                            <div style={statusIndicatorStyle}>
                                                <div style={{
                                                    ...statusDotStyle,
                                                    backgroundColor: getStatusColor(student.status)
                                                }}></div>
                                                <span style={{
                                                    color: getStatusColor(student.status),
                                                    fontWeight: '600',
                                                    fontSize: '12px'
                                                }}>
                                                    {student.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={noDataStyle}>
                                    No Data Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Statistics Section */}
            <div style={statsContainerStyle}>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Total Students</h4>
                    <p style={{ ...statValueStyle, color: '#3498db' }}>{stats.total}</p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Present</h4>
                    <p style={{ ...statValueStyle, color: '#2ecc71' }}>{stats.present}</p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Absent</h4>
                    <p style={{ ...statValueStyle, color: '#e74c3c' }}>{stats.absent}</p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Late</h4>
                    <p style={{ ...statValueStyle, color: '#f39c12' }}>{stats.late}</p>
                </div>
                <div style={statCardStyle}>
                    <h4 style={statTitleStyle}>Attendance %</h4>
                    <p style={{ ...statValueStyle, color: '#9b59b6' }}>{stats.percentage}%</p>
                </div>
            </div>

            {/* Legend */}
            <div style={legendContainerStyle}>
                <div style={legendTitleStyle}>Status Legend:</div>
                <div style={legendItemsStyle}>
                    <div style={legendItemStyle}>
                        <div style={{ ...legendDotStyle, backgroundColor: '#2ecc71' }}></div>
                        <span>Present</span>
                    </div>
                    <div style={legendItemStyle}>
                        <div style={{ ...legendDotStyle, backgroundColor: '#e74c3c' }}></div>
                        <span>Absent</span>
                    </div>
                    <div style={legendItemStyle}>
                        <div style={{ ...legendDotStyle, backgroundColor: '#f39c12' }}></div>
                        <span>Late</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const titleStyle = {
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '24px',
    fontWeight: '600'
};

const filtersContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #dee2e6'
};

const filterRowStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap'
};

const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
    minWidth: '200px'
};

const filterLabelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '4px'
};

const selectStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer'
};

const dateInputStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer'
};

const addButtonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    height: '42px',
    transition: 'background-color 0.2s',
    minWidth: '150px'
};

const saveButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    height: '42px',
    transition: 'background-color 0.2s',
    minWidth: '150px'
};

const quickActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#e8f4fc',
    borderRadius: '6px',
    border: '1px solid #b3d7ff'
};

const actionLabelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
};

const actionButtonStyle = {
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'opacity 0.3s'
};

const tableContainerStyle = {
    overflowX: 'auto',
    marginBottom: '25px',
    borderRadius: '6px',
    border: '1px solid #dee2e6'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
};

const headerRowStyle = {
    backgroundColor: '#f1f5f9'
};

const thStyle = {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#2c3e50',
    borderBottom: '2px solid #dee2e6',
    backgroundColor: '#f8f9fa'
};

const dataRowStyle = {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: '#f9f9f9'
    }
};

const tdStyle = {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#495057',
    verticalAlign: 'middle'
};

const noDataStyle = {
    padding: '40px',
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '16px',
    fontStyle: 'italic'
};

const actionButtonsContainer = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
};

const statusButtonStyle = {
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    minWidth: '32px',
    transition: 'all 0.2s',
    ':hover': {
        opacity: 0.9,
        transform: 'translateY(-1px)'
    }
};

const statusIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '10px',
    padding: '4px 10px',
    borderRadius: '20px',
    backgroundColor: '#f8f9fa'
};

const statusDotStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
};

const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
};

const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
};

const statTitleStyle = {
    margin: '0 0 10px 0',
    color: '#6c757d',
    fontSize: '14px',
    fontWeight: '600'
};

const statValueStyle = {
    margin: '0',
    fontSize: '28px',
    fontWeight: 'bold'
};

const legendContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
};

const legendTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: '100px'
};

const legendItemsStyle = {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap'
};

const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#495057'
};

const legendDotStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
};

export default Attendance;