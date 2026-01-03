import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardContent = () => {
    const [selectedClass, setSelectedClass] = useState('Class 10');
    const [selectedSection, setSelectedSection] = useState('Section A');
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState({
        currentDay: true,
        currentWeek: false,
        selectedMonth: false,
        currentMonth: false
    });

    const navigate = useNavigate();

    // Sample data for classes and sections
    const classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const sections = ['Section A', 'Section B', 'Section C', 'Section D'];

    // Classes data with details
    const classesData = [
        { name: 'Class 8', students: 40, teacher: 'Mrs. Sharma', subject: 'Math' },
        { name: 'Class 9', students: 38, teacher: 'Mr. Verma', subject: 'Science' },
        { name: 'Class 10', students: 42, teacher: 'Mrs. Gupta', subject: 'English' },
        { name: 'Class 11', students: 35, teacher: 'Mr. Singh', subject: 'Physics' },
        { name: 'Class 12', students: 32, teacher: 'Mrs. Patel', subject: 'Chemistry' }
    ];

    // Initialize attendance data
    useEffect(() => {
        generateAttendanceData();
    }, [selectedClass, selectedSection]);

    const generateAttendanceData = () => {
        // Generate mock attendance data based on selected class and section
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const mockData = days.map(day => ({
            day,
            attendance: Math.random() * 100, // Random attendance percentage
            present: Math.floor(Math.random() * 30) + 20, // Random number of present students
            total: 35 // Fixed total students
        }));
        setAttendanceData(mockData);
    };

    const handleCheckboxChange = (type) => {
        setSelectedDateRange(prev => ({
            currentDay: type === 'currentDay',
            currentWeek: type === 'currentWeek',
            selectedMonth: type === 'selectedMonth',
            currentMonth: type === 'currentMonth'
        }));
    };

    // DashboardContent.js में handleCardClick function update करें
    const handleCardClick = (cardType) => {
        switch (cardType) {
            case 'subjects':
                navigate('/lesson');
                break;
            case 'timetable':
                navigate('/timetable');
                break;
            case 'assignment':
                navigate('/assignment-create');
                break;
            case 'attendance':
                navigate('/attendance');
                break;
            case 'classes':
                navigate('/classroom');
                break;
            default:
                break;
        }
    };

    // Calculate average attendance
    const averageAttendance = attendanceData.length > 0
        ? (attendanceData.reduce((sum, day) => sum + day.attendance, 0) / attendanceData.length).toFixed(1)
        : 0;

    // Get current class info
    const currentClassInfo = classesData.find(cls => cls.name === selectedClass);

    // ================= STYLES =================

    // Dashboard styles
    const dashboardContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const welcomeHeaderStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid #eef2f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
    };

    const welcomeTitleStyle = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1f36',
        marginBottom: '10px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const welcomeSubtitleStyle = {
        fontSize: '16px',
        color: '#6b7280',
        lineHeight: '1.6',
        maxWidth: '600px'
    };

    const dateDisplayStyle = {
        textAlign: 'right'
    };

    const currentDateStyle = {
        fontSize: '14px',
        color: '#667eea',
        fontWeight: '600',
        backgroundColor: '#f3f4f6',
        padding: '8px 16px',
        borderRadius: '20px'
    };

    const topSectionStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '25px'
    };

    const dashboardCardStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '25px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #eef2f6',
        ':hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)'
        }
    };

    const cardHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px'
    };

    const cardIconStyle = (gradient) => ({
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: 'white',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    });

    const cardTitleStyle = {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1a1f36',
        margin: '0'
    };

    const cardContentStyle = {
        paddingTop: '10px'
    };

    const cardFooterStyle = {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px solid #f3f4f6'
    };

    const cardActionTextStyle = {
        fontSize: '14px',
        color: '#667eea',
        fontWeight: '600',
        transition: 'color 0.2s',
        ':hover': {
            color: '#764ba2'
        }
    };

    const subjectListStyle = {
        fontSize: '16px',
        color: '#4b5563',
        margin: '8px 0',
        fontWeight: '500',
        lineHeight: '1.6'
    };

    const classesTextStyle = {
        fontSize: '18px',
        color: '#4b5563',
        fontWeight: '600',
        margin: '0 0 8px 0'
    };

    const nextClassStyle = {
        fontSize: '14px',
        color: '#6b7280',
        margin: '0'
    };

    const classesInfoStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '15px'
    };

    const classItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const classLabelStyle = {
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500'
    };

    const classValueStyle = {
        fontSize: '14px',
        color: '#374151',
        fontWeight: '600'
    };

    const progressBarContainer = {
        marginTop: '15px'
    };

    const progressBarStyle = {
        width: '100%',
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative'
    };

    const progressFillStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '75%',
        background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
        borderRadius: '10px',
        transition: 'width 0.5s ease'
    };

    const progressTextStyle = {
        display: 'block',
        textAlign: 'center',
        marginTop: '8px',
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '600'
    };

    const assignmentStatsStyle = {
        fontSize: '13px',
        color: '#6b7280',
        margin: '10px 0 0 0',
        textAlign: 'center'
    };

    const bottomSectionStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        border: '1px solid #eef2f6'
    };

    const detailCardStyle = {
        width: '100%'
    };

    const detailCardHeaderStyle = {
        padding: '25px 30px',
        borderBottom: '1px solid #eef2f6',
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const detailCardTitleStyle = {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a1f36',
        margin: '0'
    };

    const averageAttendanceStyle = {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600'
    };

    const detailCardContentStyle = {
        padding: '30px'
    };

    const attendanceFiltersStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '25px'
    };

    const filterItemStyle = (isSelected) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: isSelected ? '#667eea' : '#f3f4f6',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: isSelected ? '#764ba2' : '#e5e7eb'
        }
    });

    const checkboxStyle = {
        width: '16px',
        height: '16px',
        cursor: 'pointer'
    };

    const filterLabelStyle = (isSelected) => ({
        fontSize: '14px',
        color: isSelected ? 'white' : '#374151',
        fontWeight: '500',
        cursor: 'pointer'
    });

    const dividerStyle = {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '25px 0'
    };

    const selectionContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '25px'
    };

    const selectionItemStyle = {
        display: 'flex',
        flexDirection: 'column'
    };

    const sectionTitleStyle = {
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '12px'
    };

    const selectStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '15px',
        color: '#374151',
        backgroundColor: 'white',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.2s',
        ':focus': {
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
        }
    };

    const chartSectionStyle = {
        marginTop: '30px'
    };

    const chartHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
    };

    const chartInfoStyle = {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
    };

    const infoItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#6b7280'
    };

    const infoColorStyle = (color) => ({
        width: '12px',
        height: '12px',
        backgroundColor: color,
        borderRadius: '3px'
    });

    const chartContainerStyle = {
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
    };

    const yAxisStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '200px',
        paddingBottom: '40px'
    };

    const yAxisLabelStyle = {
        height: '33.33px',
        display: 'flex',
        alignItems: 'center'
    };

    const yAxisTextStyle = {
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '500',
        minWidth: '40px'
    };

    const chartContentStyle = {
        flex: '1'
    };

    const chartBarsStyle = {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '20px',
        height: '200px',
        paddingBottom: '40px',
        position: 'relative'
    };

    const chartBarContainerStyle = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        height: '100%'
    };

    const chartBarBackgroundStyle = {
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px 6px 0 0',
        position: 'relative',
        overflow: 'hidden'
    };

    const chartBarFillStyle = (percentage) => ({
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: `${percentage}%`,
        backgroundColor: '#667eea',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        transition: 'height 0.5s ease',
        cursor: 'pointer',
        ':hover': {
            opacity: '0.9'
        }
    });

    const dayLabelStyle = {
        fontSize: '13px',
        color: '#374151',
        fontWeight: '600',
        marginTop: '8px'
    };

    const attendanceValueStyle = {
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '500'
    };

    const chartXAxisStyle = {
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
    };

    const xAxisLabelStyle = {
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500'
    };

    const statsContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
    };

    const statItemStyle = {
        textAlign: 'center',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #eef2f6'
    };

    const statValueStyle = {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1a1f36',
        marginBottom: '5px'
    };

    const statLabelStyle = {
        fontSize: '13px',
        color: '#6b7280',
        fontWeight: '500'
    };

    // Main content style
    const mainContentStyle = {
        padding: '0',
        flex: '1'
    };

    return (
        <div style={mainContentStyle}>
            <div style={dashboardContainerStyle}>
                {/* Welcome Header */}
                <div style={welcomeHeaderStyle}>
                    <div>
                        <h1 style={welcomeTitleStyle}>Welcome to Teacher Dashboard</h1>
                        <p style={welcomeSubtitleStyle}>
                            Manage your classes, track attendance, and monitor student progress from one place
                        </p>
                    </div>
                    <div style={dateDisplayStyle}>
                        <div style={currentDateStyle}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>

                {/* Top Section with 4 Cards */}
                <div style={topSectionStyle}>
                    {/* Card 1: Subjects Card */}
                    <div
                        style={dashboardCardStyle}
                        onClick={() => handleCardClick('subjects')}
                    >
                        <div style={cardHeaderStyle}>
                            <div style={cardIconStyle('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}>📚</div>
                            <h3 style={cardTitleStyle}>Subjects</h3>
                        </div>
                        <div style={cardContentStyle}>
                            <p style={subjectListStyle}>Math, Science, History</p>
                            <p style={subjectListStyle}>Arts, English</p>
                            <div style={cardFooterStyle}>
                                <span style={cardActionTextStyle}>Manage Subjects →</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Time Table Card */}
                    <div
                        style={dashboardCardStyle}
                        onClick={() => handleCardClick('timetable')}
                    >
                        <div style={cardHeaderStyle}>
                            <div style={cardIconStyle('linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)')}>⏰</div>
                            <h3 style={cardTitleStyle}>Time Table</h3>
                        </div>
                        <div style={cardContentStyle}>
                            <p style={classesTextStyle}>Today's Classes: 6</p>
                            <p style={nextClassStyle}>Next: Math (10:00 AM)</p>
                            <div style={cardFooterStyle}>
                                <span style={cardActionTextStyle}>View Schedule →</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Classes Card */}
                    <div
                        style={dashboardCardStyle}
                        onClick={() => handleCardClick('classes')}
                    >
                        <div style={cardHeaderStyle}>
                            <div style={cardIconStyle('linear-gradient(135deg, #FF5722 0%, #FF9800 100%)')}>🏫</div>
                            <h3 style={cardTitleStyle}>Classes</h3>
                        </div>
                        <div style={cardContentStyle}>
                            <p style={classesTextStyle}>Total Classes: {classesData.length}</p>
                            <p style={nextClassStyle}>Active: Class 10</p>
                            <div style={classesInfoStyle}>
                                <div style={classItemStyle}>
                                    <span style={classLabelStyle}>Students:</span>
                                    <span style={classValueStyle}>{currentClassInfo?.students || 0}</span>
                                </div>
                                <div style={classItemStyle}>
                                    <span style={classLabelStyle}>Teacher:</span>
                                    <span style={classValueStyle}>{currentClassInfo?.teacher || 'N/A'}</span>
                                </div>
                            </div>
                            <div style={cardFooterStyle}>
                                <span style={cardActionTextStyle}>Manage Classes →</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Assignment Progress Card */}
                    <div
                        style={dashboardCardStyle}
                        onClick={() => handleCardClick('assignment')}
                    >
                        <div style={cardHeaderStyle}>
                            <div style={cardIconStyle('linear-gradient(135deg, #FF9800 0%, #FF5722 100%)')}>📝</div>
                            <h3 style={cardTitleStyle}>Assignment Progress</h3>
                        </div>
                        <div style={cardContentStyle}>
                            <div style={progressBarContainer}>
                                <div style={progressBarStyle}>
                                    <div style={progressFillStyle}></div>
                                </div>
                                <span style={progressTextStyle}>75% Complete</span>
                            </div>
                            <p style={assignmentStatsStyle}>Pending: 3 | Submitted: 12</p>
                            <div style={cardFooterStyle}>
                                <span style={cardActionTextStyle}>Check Assignments →</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Detailed View */}
                <div style={bottomSectionStyle}>
                    <div style={detailCardStyle}>
                        <div style={detailCardHeaderStyle}>
                            <h3 style={detailCardTitleStyle}>Attendance Overview</h3>
                            <div style={averageAttendanceStyle}>
                                Avg: {averageAttendance}%
                            </div>
                        </div>

                        <div style={detailCardContentStyle}>
                            {/* Attendance Filters */}
                            <div style={attendanceFiltersStyle}>
                                {[
                                    { id: 'currentDay', label: 'Current Day' },
                                    { id: 'currentWeek', label: 'Current Week' },
                                    { id: 'selectedMonth', label: 'Selected Month' },
                                    { id: 'currentMonth', label: 'Current Month' }
                                ].map((item) => (
                                    <div key={item.id} style={filterItemStyle(selectedDateRange[item.id])}>
                                        <input
                                            type="checkbox"
                                            style={checkboxStyle}
                                            checked={selectedDateRange[item.id]}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            id={item.id}
                                        />
                                        <label
                                            htmlFor={item.id}
                                            style={filterLabelStyle(selectedDateRange[item.id])}
                                        >
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div style={dividerStyle}></div>

                            {/* Class and Section Selection */}
                            <div style={selectionContainerStyle}>
                                <div style={selectionItemStyle}>
                                    <h4 style={sectionTitleStyle}>Select Class</h4>
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

                                <div style={selectionItemStyle}>
                                    <h4 style={sectionTitleStyle}>Select Section</h4>
                                    <select
                                        style={selectStyle}
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        {sections.map(section => (
                                            <option key={section} value={section}>{section}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={dividerStyle}></div>

                            {/* Weekly Attendance Chart */}
                            <div style={chartSectionStyle}>
                                <div style={chartHeaderStyle}>
                                    <h4 style={sectionTitleStyle}>Attendance Overview - Weekly</h4>
                                    <div style={chartInfoStyle}>
                                        <div style={infoItemStyle}>
                                            <div style={infoColorStyle('#667eea')}></div>
                                            <span>Present Students</span>
                                        </div>
                                        <div style={infoItemStyle}>
                                            <div style={infoColorStyle('#e5e7eb')}></div>
                                            <span>Total Students: 35</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={chartContainerStyle}>
                                    {/* Y-axis labels */}
                                    <div style={yAxisStyle}>
                                        {[100, 80, 60, 40, 20, 0].map(value => (
                                            <div key={value} style={yAxisLabelStyle}>
                                                <span style={yAxisTextStyle}>{value}%</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart bars */}
                                    <div style={chartContentStyle}>
                                        <div style={chartBarsStyle}>
                                            {attendanceData.map((dayData, index) => (
                                                <div key={index} style={chartBarContainerStyle}>
                                                    <div style={chartBarBackgroundStyle}>
                                                        <div
                                                            style={chartBarFillStyle(dayData.attendance)}
                                                            title={`${dayData.attendance.toFixed(1)}% (${dayData.present}/${dayData.total})`}
                                                        ></div>
                                                    </div>
                                                    <span style={dayLabelStyle}>{dayData.day}</span>
                                                    <span style={attendanceValueStyle}>
                                                        {dayData.attendance.toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* X-axis label */}
                                        <div style={chartXAxisStyle}>
                                            <span style={xAxisLabelStyle}>Week Days</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div style={statsContainerStyle}>
                                    <div style={statItemStyle}>
                                        <div style={statValueStyle}>{averageAttendance}%</div>
                                        <div style={statLabelStyle}>Average Attendance</div>
                                    </div>
                                    <div style={statItemStyle}>
                                        <div style={statValueStyle}>
                                            {attendanceData.reduce((sum, day) => sum + day.present, 0)}
                                        </div>
                                        <div style={statLabelStyle}>Total Present</div>
                                    </div>
                                    <div style={statItemStyle}>
                                        <div style={statValueStyle}>
                                            {Math.max(...attendanceData.map(d => d.attendance)).toFixed(1)}%
                                        </div>
                                        <div style={statLabelStyle}>Highest</div>
                                    </div>
                                    <div style={statItemStyle}>
                                        <div style={statValueStyle}>
                                            {Math.min(...attendanceData.map(d => d.attendance)).toFixed(1)}%
                                        </div>
                                        <div style={statLabelStyle}>Lowest</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;