import React, { useState } from 'react';

const StudentDetails = () => {
    const [activeTab, setActiveTab] = useState('admit-card');
    const [students, setStudents] = useState([
        { id: 1, name: 'Rahul Sharma', class: '10th', section: 'A', rollNo: '101', dob: '2008-05-15', contact: '9876543210' },
        { id: 2, name: 'Priya Patel', class: '10th', section: 'B', rollNo: '102', dob: '2008-08-22', contact: '9876543211' },
        { id: 3, name: 'Amit Kumar', class: '9th', section: 'A', rollNo: '201', dob: '2009-03-10', contact: '9876543212' },
        { id: 4, name: 'Sneha Singh', class: '9th', section: 'B', rollNo: '202', dob: '2009-07-18', contact: '9876543213' },
        { id: 5, name: 'Rohan Gupta', class: '8th', section: 'A', rollNo: '301', dob: '2010-01-25', contact: '9876543214' },
    ]);

    const [newStudent, setNewStudent] = useState({
        name: '', class: '', section: '', rollNo: '', dob: '', contact: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Chat state
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Rahul Sharma', message: 'Hello Sir, I have a doubt in Maths', time: '10:30 AM' },
        { id: 2, sender: 'Teacher', message: 'Yes Rahul, what is your doubt?', time: '10:32 AM' },
        { id: 3, sender: 'Priya Patel', message: 'When is the next PTM?', time: '11:15 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Announcements state (specific to student)
    const [studentAnnouncements] = useState([ // Remove setStudentAnnouncements since it's not used
        { id: 1, title: 'PTM Schedule', content: 'Parent-Teacher meeting scheduled for 25th Jan', date: '2024-01-20' },
        { id: 2, title: 'Sports Day', content: 'Annual sports day on 30th January', date: '2024-01-18' },
        { id: 3, title: 'Library Notice', content: 'Library will remain closed on Sunday', date: '2024-01-15' },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent({ ...newStudent, [name]: value });
    };

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.class) {
            alert('Please fill required fields');
            return;
        }
        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        setStudents([...students, { ...newStudent, id: newId }]);
        setNewStudent({ name: '', class: '', section: '', rollNo: '', dob: '', contact: '' });
    };

    const handleDeleteStudent = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            setStudents(students.filter(student => student.id !== id));
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
        const newMsg = {
            id: newId,
            sender: 'You',
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'admit-card':
                return (
                    <div>
                        <h3 style={sectionTitleStyle}>Student Admit Cards</h3>
                        <div style={admitCardGridStyle}>
                            {students.map(student => (
                                <div key={student.id} style={admitCardStyle}>
                                    <div style={admitCardHeaderStyle}>
                                        <h4>ADMIT CARD</h4>
                                        <div style={statusBadgeStyle}>Generated</div>
                                    </div>
                                    <div style={admitCardBodyStyle}>
                                        <div style={studentPhotoStyle}></div>
                                        <div style={studentInfoStyle}>
                                            <p><strong>Name:</strong> {student.name}</p>
                                            <p><strong>Roll No:</strong> {student.rollNo}</p>
                                            <p><strong>Class:</strong> {student.class} {student.section}</p>
                                            <p><strong>DOB:</strong> {student.dob}</p>
                                        </div>
                                    </div>
                                    <button style={downloadButtonStyle}>
                                        ⬇️ Download Admit Card
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'chat':
                return (
                    <div>
                        <h3 style={sectionTitleStyle}>Student Chat</h3>
                        <div style={chatContainerStyle}>
                            <div style={chatHeaderStyle}>
                                <select style={chatSelectStyle}>
                                    <option>Select Student to Chat</option>
                                    {students.map(s => (
                                        <option key={s.id}>{s.name} - {s.class}</option>
                                    ))}
                                </select>
                                <button style={newChatButtonStyle}>New Chat</button>
                            </div>

                            <div style={chatMessagesStyle}>
                                {messages.map(msg => (
                                    <div key={msg.id} style={{
                                        ...messageStyle,
                                        alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'You' ? '#4a6ee0' : '#f1f1f1',
                                        color: msg.sender === 'You' ? 'white' : '#333'
                                    }}>
                                        <div style={messageSenderStyle}>{msg.sender}</div>
                                        <div style={messageTextStyle}>{msg.message}</div>
                                        <div style={messageTimeStyle}>{msg.time}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={chatInputStyle}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    style={messageInputStyle}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage} style={sendButtonStyle}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'announcement':
                return (
                    <div>
                        <h3 style={sectionTitleStyle}>Announcements for Students</h3>
                        <div style={announcementsGridStyle}>
                            {studentAnnouncements.map(ann => (
                                <div key={ann.id} style={announcementCardStyle}>
                                    <div style={announcementHeaderStyle}>
                                        <h4>{ann.title}</h4>
                                        <span style={announcementDateStyle}>{ann.date}</span>
                                    </div>
                                    <p style={announcementContentStyle}>{ann.content}</p>
                                    <button style={viewDetailsButtonStyle}>
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div>
                        <h3 style={sectionTitleStyle}>Student Details Management</h3>
                        {/* Student table code here */}
                    </div>
                );
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>📋 Student Details</h2>

            {/* Tabs */}
            <div style={tabsContainerStyle}>
                <button
                    style={{
                        ...tabButtonStyle,
                        backgroundColor: activeTab === 'admit-card' ? '#4a6ee0' : '#f8f9fa',
                        color: activeTab === 'admit-card' ? 'white' : '#2c3e50'
                    }}
                    onClick={() => setActiveTab('admit-card')}
                >
                    🎫 Admit Card
                </button>
                <button
                    style={{
                        ...tabButtonStyle,
                        backgroundColor: activeTab === 'chat' ? '#4a6ee0' : '#f8f9fa',
                        color: activeTab === 'chat' ? 'white' : '#2c3e50'
                    }}
                    onClick={() => setActiveTab('chat')}
                >
                    💬 Chat
                </button>
                <button
                    style={{
                        ...tabButtonStyle,
                        backgroundColor: activeTab === 'announcement' ? '#4a6ee0' : '#f8f9fa',
                        color: activeTab === 'announcement' ? 'white' : '#2c3e50'
                    }}
                    onClick={() => setActiveTab('announcement')}
                >
                    📢 Announcement
                </button>
            </div>

            {/* Main Content based on active tab */}
            <div style={contentContainerStyle}>
                {renderContent()}
            </div>

            {/* Student Management Section (shown only for admit-card tab) */}
            {activeTab === 'admit-card' && (
                <>
                    {/* Add Student Form */}
                    <div style={formContainerStyle}>
                        <h3 style={sectionTitleStyle}>Add New Student</h3>
                        <div style={formStyle}>
                            <input type="text" name="name" placeholder="Full Name" value={newStudent.name} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="class" placeholder="Class" value={newStudent.class} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="section" placeholder="Section" value={newStudent.section} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="rollNo" placeholder="Roll Number" value={newStudent.rollNo} onChange={handleInputChange} style={inputStyle} />
                            <input type="date" name="dob" value={newStudent.dob} onChange={handleInputChange} style={inputStyle} />
                            <input type="tel" name="contact" placeholder="Contact Number" value={newStudent.contact} onChange={handleInputChange} style={inputStyle} />
                            <button onClick={handleAddStudent} style={addButtonStyle}>Add Student</button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={searchContainerStyle}>
                        <input
                            type="text"
                            placeholder="Search by name, class or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={searchInputStyle}
                        />
                        <span style={countStyle}>{filteredStudents.length} students found</span>
                    </div>

                    {/* Students Table */}
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Roll No</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Class</th>
                                    <th style={thStyle}>Section</th>
                                    <th style={thStyle}>Date of Birth</th>
                                    <th style={thStyle}>Contact</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} style={trStyle}>
                                        <td style={tdStyle}>{student.rollNo}</td>
                                        <td style={tdStyle}>{student.name}</td>
                                        <td style={tdStyle}>{student.class}</td>
                                        <td style={tdStyle}>{student.section}</td>
                                        <td style={tdStyle}>{student.dob}</td>
                                        <td style={tdStyle}>{student.contact}</td>
                                        <td style={tdStyle}>
                                            <button style={editButtonStyle}>Edit</button>
                                            <button
                                                style={deleteButtonStyle}
                                                onClick={() => handleDeleteStudent(student.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div style={summaryStyle}>
                        <div style={summaryItemStyle}>
                            <h4>Total Students</h4>
                            <p style={summaryValueStyle}>{students.length}</p>
                        </div>
                        <div style={summaryItemStyle}>
                            <h4>Classes</h4>
                            <p style={summaryValueStyle}>{[...new Set(students.map(s => s.class))].length}</p>
                        </div>
                        <div style={summaryItemStyle}>
                            <h4>Sections</h4>
                            <p style={summaryValueStyle}>{[...new Set(students.map(s => s.section))].length}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Styles (all styles remain the same as before)
const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
};

const titleStyle = {
    color: '#2c3e50',
    marginBottom: '25px',
    borderBottom: '2px solid #4a6ee0',
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const tabsContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px'
};

const tabButtonStyle = {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const contentContainerStyle = {
    marginBottom: '25px'
};

const sectionTitleStyle = {
    color: '#2c3e50',
    marginBottom: '20px'
};

// Admit Card Styles
const admitCardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
};

const admitCardStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center'
};

const admitCardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
};

const statusBadgeStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px'
};

const admitCardBodyStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '15px'
};

const studentPhotoStyle = {
    width: '80px',
    height: '100px',
    backgroundColor: '#ddd',
    borderRadius: '5px'
};

const studentInfoStyle = {
    textAlign: 'left',
    flex: '1'
};

const downloadButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
};

// Chat Styles
const chatContainerStyle = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '500px',
    display: 'flex',
    flexDirection: 'column'
};

const chatHeaderStyle = {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    gap: '10px'
};

const chatSelectStyle = {
    flex: '1',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd'
};

const newChatButtonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
};

const chatMessagesStyle = {
    flex: '1',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const messageStyle = {
    maxWidth: '70%',
    padding: '12px 15px',
    borderRadius: '15px',
    marginBottom: '5px'
};

const messageSenderStyle = {
    fontWeight: 'bold',
    fontSize: '12px',
    marginBottom: '5px'
};

const messageTextStyle = {
    fontSize: '14px',
    lineHeight: '1.4'
};

const messageTimeStyle = {
    fontSize: '11px',
    textAlign: 'right',
    marginTop: '5px',
    opacity: '0.7'
};

const chatInputStyle = {
    padding: '15px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    gap: '10px'
};

const messageInputStyle = {
    flex: '1',
    padding: '12px',
    borderRadius: '25px',
    border: '1px solid #ddd'
};

const sendButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '0 25px',
    borderRadius: '25px',
    cursor: 'pointer'
};

// Announcement Styles
const announcementsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
};

const announcementCardStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px'
};

const announcementHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
};

const announcementDateStyle = {
    fontSize: '12px',
    color: '#7f8c8d'
};

const announcementContentStyle = {
    color: '#5d6d7e',
    lineHeight: '1.6',
    marginBottom: '15px'
};

const viewDetailsButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
};

// Original Form Styles
const formContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px'
};

const formStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    alignItems: 'end'
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px'
};

const addButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    gridColumn: '1 / -1',
    justifySelf: 'start'
};

const searchContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
};

const searchInputStyle = {
    padding: '10px 15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '70%',
    fontSize: '14px'
};

const countStyle = {
    color: '#7f8c8d',
    fontSize: '14px'
};

const tableContainerStyle = {
    overflowX: 'auto',
    marginBottom: '25px'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const thStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px'
};

const trStyle = {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.3s'
};

const tdStyle = {
    padding: '12px',
    fontSize: '14px'
};

const editButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px',
    transition: 'background-color 0.3s'
};

const deleteButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background-color 0.3s'
};

const summaryStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px'
};

const summaryItemStyle = {
    textAlign: 'center'
};

const summaryValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4a6ee0',
    marginTop: '5px'
};

export default StudentDetails;