import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Confirmation Dialog Component
const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!open) return null;

    return (
        <div style={confirmationOverlayStyle}>
            <div style={confirmationDialogStyle}>
                <h3 style={confirmationTitleStyle}>{title}</h3>
                <p style={confirmationMessageStyle}>{message}</p>
                <div style={confirmationButtonsStyle}>
                    <button
                        style={confirmButtonStyle}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                    <button
                        style={cancelDialogButtonStyle}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Container Component
const AdmitCardSystem = () => {
    const [activeTab, setActiveTab] = useState('view');

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>🎫 ADMIT CARD MANAGEMENT</h1>
                <div style={tabContainerStyle}>
                    <button
                        style={activeTab === 'view' ? activeTabStyle : tabStyle}
                        onClick={() => setActiveTab('view')}
                    >
                        📋 View Admit Cards
                    </button>
                    <button
                        style={activeTab === 'create' ? activeTabStyle : tabStyle}
                        onClick={() => setActiveTab('create')}
                    >
                        ➕ Create New Admit
                    </button>
                </div>
            </div>

            {activeTab === 'view' ? <ViewAdmitCard /> : <CreateNewAdmit />}
        </div>
    );
};

// Component 1: View Admit Card (First Image Format)
const ViewAdmitCard = () => {
    const [admitDetails, setAdmitDetails] = useState([
        {
            id: 1,
            studentName: 'Rahul Sharma',
            rollNo: '2024101',
            admissionNo: 'ADM001',
            fatherName: 'Rajesh Sharma',
            mobileNo: '9876543210',
            action: 'view'
        },
        {
            id: 2,
            studentName: 'Priya Patel',
            rollNo: '2024102',
            admissionNo: 'ADM002',
            fatherName: 'Ramesh Patel',
            mobileNo: '9876543211',
            action: 'view'
        },
        {
            id: 3,
            studentName: 'Amit Kumar',
            rollNo: '2024103',
            admissionNo: 'ADM003',
            fatherName: 'Sanjay Kumar',
            mobileNo: '9876543212',
            action: 'view'
        },
        {
            id: 4,
            studentName: 'Sneha Singh',
            rollNo: '2024104',
            admissionNo: 'ADM004',
            fatherName: 'Vikram Singh',
            mobileNo: '9876543213',
            action: 'view'
        }
    ]);

    const [filters, setFilters] = useState({
        examType: '',
        subExam: '',
        session: '2025-2026',
        class: '',
        section: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [confirmation, setConfirmation] = useState({
        open: false,
        title: '',
        message: '',
        action: null,
        studentId: null,
        studentName: ''
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleGetAdmitDetails = () => {
        if (!filters.examType || !filters.class) {
            setSnackbar({
                open: true,
                message: 'Please select Exam Type and Class',
                severity: 'warning'
            });
            return;
        }

        setSnackbar({
            open: true,
            message: `Admit details fetched for ${filters.class}`,
            severity: 'success'
        });
    };

    const showDeleteConfirmation = (id, studentName) => {
        setConfirmation({
            open: true,
            title: 'Delete Confirmation',
            message: `Are you sure you want to delete admit card for ${studentName}?`,
            action: 'delete',
            studentId: id,
            studentName: studentName
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmation.action === 'delete') {
            setAdmitDetails(prev => prev.filter(item => item.id !== confirmation.studentId));
            setSnackbar({
                open: true,
                message: `Admit card for ${confirmation.studentName} deleted successfully`,
                severity: 'info'
            });
        }
        setConfirmation({ open: false, title: '', message: '', action: null, studentId: null, studentName: '' });
    };

    const handleDownload = async (student) => {
        try {
            // Create a temporary div to generate the PDF content
            const element = document.createElement('div');
            element.style.width = '794px'; // A4 width
            element.style.padding = '40px';
            element.style.backgroundColor = 'white';
            element.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
            element.style.boxSizing = 'border-box';

            const examDetails = {
                ...filters,
                examType: filters.examType || 'Annual Examination',
                subExam: filters.subExam || 'All Subjects',
                session: filters.session || '2025-2026',
                class: filters.class || '10',
                section: filters.section || 'A'
            };

            element.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4a6ee0; padding-bottom: 20px;">
                    <h2 style="color: #2c3e50; font-size: 28px; font-weight: bold; margin-bottom: 10px;">EXAMINATION ADMIT CARD</h2>
                    <div style="color: #555;">
                        <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 5px; color: #2c3e50;">MODEL HIGH SCHOOL</h3>
                        <p style="font-size: 14px; margin-bottom: 3px;">123 Education Street, Academic City, AC 12345</p>
                        <p style="font-size: 13px; color: #666;">Phone: (123) 456-7890 | Email: info@modelhigh.edu</p>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <div style="display: flex; gap: 40px; margin-bottom: 30px; align-items: flex-start;">
                        <div style="flex: 0 0 auto;">
                            <div style="width: 120px; height: 150px; border: 2px dashed #999; border-radius: 8px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                                <span style="color: #666; font-size: 12px; text-align: center; padding: 10px;">STUDENT PHOTO</span>
                            </div>
                        </div>
                        
                        <div style="flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Student Name:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.studentName}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Roll Number:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.rollNo}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Admission No:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.admissionNo}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Father's Name:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.fatherName}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Class:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.class}th</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Section:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.section}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Academic Year:</span>
                                <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.session}</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #4a6ee0; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">EXAMINATION DETAILS</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Exam Type:</span>
                                <span style="font-size: 14px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.examType}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <span style="font-size: 13px; color: #666; font-weight: 500;">Sub Exam:</span>
                                <span style="font-size: 14px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.subExam}</span>
                            </div>
                        </div>

                        <h3 style="color: #4a6ee0; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">EXAMINATION SCHEDULE</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px;">
                            <thead>
                                <tr style="background-color: #4a6ee0;">
                                    <th style="color: white; padding: 10px; text-align: left; font-weight: 600; border: 1px solid #3a5ec0;">Date</th>
                                    <th style="color: white; padding: 10px; text-align: left; font-weight: 600; border: 1px solid #3a5ec0;">Subject</th>
                                    <th style="color: white; padding: 10px; text-align: left; font-weight: 600; border: 1px solid #3a5ec0;">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid #e9ecef;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-15</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">Mathematics</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 12:00</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e9ecef;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-16</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">Science</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 12:00</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e9ecef;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-17</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">English</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 11:00</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e9ecef;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-18</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">Hindi</td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 11:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #4a6ee0; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">INSTRUCTIONS</h3>
                        <ul style="padding-left: 20px; margin: 0;">
                            <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Candidate must report at the examination center 30 minutes before the exam.</li>
                            <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Bring this admit card and school ID card to the examination hall.</li>
                            <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">No electronic devices are allowed in the examination hall.</li>
                            <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Follow all COVID-19 safety protocols as per school guidelines.</li>
                            <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Any malpractice will lead to disqualification.</li>
                        </ul>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                        <div style="text-align: center; flex: 1;">
                            <div style="width: 150px; height: 1px; background-color: #333; margin: 0 auto 10px auto;"></div>
                            <p style="font-size: 12px; color: #666; margin-top: 5px;">Class Teacher's Signature</p>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="width: 150px; height: 1px; background-color: #333; margin: 0 auto 10px auto;"></div>
                            <p style="font-size: 12px; color: #666; margin-top: 5px;">Principal's Signature</p>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="width: 150px; height: 1px; background-color: #333; margin: 0 auto 10px auto;"></div>
                            <p style="font-size: 12px; color: #666; margin-top: 5px;">School Stamp</p>
                        </div>
                    </div>

                    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e9ecef; padding-top: 15px;">
                        <p style="margin-bottom: 5px;">This is a computer generated document. No signature required.</p>
                        <p style="font-size: 11px; color: #999;">Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            `;

            // Append element to body
            document.body.appendChild(element);

            // Use html2canvas to capture the element as an image
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            // Remove the temporary element
            document.body.removeChild(element);

            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Save the PDF with student name
            pdf.save(`AdmitCard_${student.studentName.replace(/\s+/g, '_')}.pdf`);

            setSnackbar({
                open: true,
                message: `Admit card for ${student.studentName} downloaded successfully`,
                severity: 'success'
            });

        } catch (error) {
            console.error('Error downloading PDF:', error);
            setSnackbar({
                open: true,
                message: `Error downloading admit card: ${error.message}`,
                severity: 'error'
            });
        }
    };

    const handlePrint = (student) => {
        // Create a temporary div for printing
        const element = document.createElement('div');
        element.style.width = '794px';
        element.style.padding = '40px';
        element.style.backgroundColor = 'white';
        element.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        element.style.boxSizing = 'border-box';

        const examDetails = {
            ...filters,
            examType: filters.examType || 'Annual Examination',
            subExam: filters.subExam || 'All Subjects',
            session: filters.session || '2025-2026',
            class: filters.class || '10',
            section: filters.section || 'A'
        };

        element.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4a6ee0; padding-bottom: 20px;">
                <h2 style="color: #2c3e50; font-size: 28px; font-weight: bold; margin-bottom: 10px;">EXAMINATION ADMIT CARD</h2>
                <div style="color: #555;">
                    <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 5px; color: #2c3e50;">MODEL HIGH SCHOOL</h3>
                    <p style="font-size: 14px; margin-bottom: 3px;">123 Education Street, Academic City, AC 12345</p>
                    <p style="font-size: 13px; color: #666;">Phone: (123) 456-7890 | Email: info@modelhigh.edu</p>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <div style="display: flex; gap: 40px; margin-bottom: 30px; align-items: flex-start;">
                    <div style="flex: 0 0 auto;">
                        <div style="width: 120px; height: 150px; border: 2px dashed #999; border-radius: 8px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                            <span style="color: #666; font-size: 12px; text-align: center; padding: 10px;">STUDENT PHOTO</span>
                        </div>
                    </div>
                    
                    <div style="flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Student Name:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.studentName}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Roll Number:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.rollNo}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Admission No:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.admissionNo}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Father's Name:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${student.fatherName}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Class:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.class}th</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Section:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.section}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Academic Year:</span>
                            <span style="font-size: 15px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.session}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #4a6ee0; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">EXAMINATION DETAILS</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Exam Type:</span>
                            <span style="font-size: 14px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.examType}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="font-size: 13px; color: #666; font-weight: 500;">Sub Exam:</span>
                            <span style="font-size: 14px; color: #2c3e50; font-weight: 600; padding: 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">${examDetails.subExam}</span>
                        </div>
                    </div>

                    <h3 style="color: #4a6ee0; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">EXAMINATION SCHEDULE</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #4a6ee0;">
                                <th style="color: white; padding: 10px; text-align: left; font-weight: 600; border: 1px solid #3a5ec0;">Date</th>
                                <th style="color: white; padding: 10px; text-align: left; font-weight: 600; border: 1px solid #3a5ec0;">Subject</th>
                                <th style="color: white; padding: 10px; text-align: left; font-weight: 600; border: 1px solid #3a5ec0;">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-15</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">Mathematics</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 12:00</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-16</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">Science</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 12:00</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-17</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">English</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 11:00</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px; border: 1px solid #dee2e6;">2025-03-18</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">Hindi</td>
                                <td style="padding: 10px; border: 1px solid #dee2e6;">09:00 - 11:00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #4a6ee0; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">INSTRUCTIONS</h3>
                    <ul style="padding-left: 20px; margin: 0;">
                        <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Candidate must report at the examination center 30 minutes before the exam.</li>
                        <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Bring this admit card and school ID card to the examination hall.</li>
                        <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">No electronic devices are allowed in the examination hall.</li>
                        <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Follow all COVID-19 safety protocols as per school guidelines.</li>
                        <li style="font-size: 13px; color: #444; margin-bottom: 8px; line-height: 1.5;">Any malpractice will lead to disqualification.</li>
                    </ul>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                    <div style="text-align: center; flex: 1;">
                        <div style="width: 150px; height: 1px; background-color: #333; margin: 0 auto 10px auto;"></div>
                        <p style="font-size: 12px; color: #666; margin-top: 5px;">Class Teacher's Signature</p>
                    </div>
                    <div style="text-align: center; flex: 1;">
                        <div style="width: 150px; height: 1px; background-color: #333; margin: 0 auto 10px auto;"></div>
                        <p style="font-size: 12px; color: #666; margin-top: 5px;">Principal's Signature</p>
                    </div>
                    <div style="text-align: center; flex: 1;">
                        <div style="width: 150px; height: 1px; background-color: #333; margin: 0 auto 10px auto;"></div>
                        <p style="font-size: 12px; color: #666; margin-top: 5px;">School Stamp</p>
                    </div>
                </div>

                <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e9ecef; padding-top: 15px;">
                    <p style="margin-bottom: 5px;">This is a computer generated document. No signature required.</p>
                    <p style="font-size: 11px; color: #999;">Generated on: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Admit Card - ${student.studentName}</title>
                    <style>
                        @media print {
                            @page {
                                size: A4;
                                margin: 20mm;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            margin: 0;
                            padding: 20px;
                            background: white;
                        }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();

        setSnackbar({
            open: true,
            message: `Admit card for ${student.studentName} sent to printer`,
            severity: 'success'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleCloseConfirmation = () => {
        setConfirmation({ open: false, title: '', message: '', action: null, studentId: null, studentName: '' });
    };

    return (
        <div style={cardStyle}>
            <h2 style={cardTitleStyle}>ADMIT CARD</h2>

            {/* Filters Section */}
            <div style={filtersContainerStyle}>
                <h3 style={sectionTitleStyle}>GET ADMIT DETAILS</h3>
                <div style={filtersGridStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Exam Type</label>
                        <select
                            style={selectStyle}
                            value={filters.examType}
                            onChange={(e) => handleFilterChange('examType', e.target.value)}
                        >
                            <option value="">Select Exam Type</option>
                            <option value="Annual Examination">Annual Examination</option>
                            <option value="Mid-Term Exam">Mid-Term Exam</option>
                            <option value="Unit Test">Unit Test</option>
                            <option value="Final Exam">Final Exam</option>
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Sub Exam</label>
                        <select
                            style={selectStyle}
                            value={filters.subExam}
                            onChange={(e) => handleFilterChange('subExam', e.target.value)}
                        >
                            <option value="">Select Sub Exam</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Session</label>
                        <input
                            type="text"
                            style={inputStyle}
                            value={filters.session}
                            readOnly
                        />
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Class</label>
                        <select
                            style={selectStyle}
                            value={filters.class}
                            onChange={(e) => handleFilterChange('class', e.target.value)}
                        >
                            <option value="">Select Class</option>
                            <option value="10">10th</option>
                            <option value="9">9th</option>
                            <option value="8">8th</option>
                            <option value="7">7th</option>
                            <option value="6">6th</option>
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Section</label>
                        <select
                            style={selectStyle}
                            value={filters.section}
                            onChange={(e) => handleFilterChange('section', e.target.value)}
                        >
                            <option value="">Select Section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>&nbsp;</label>
                        <button
                            style={getDetailsButtonStyle}
                            onClick={handleGetAdmitDetails}
                        >
                            <SearchIcon style={{ marginRight: '5px' }} />
                            GET ADMIT DETAILS
                        </button>
                    </div>
                </div>
            </div>

            {/* Admit Details Table */}
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Student Name</th>
                            <th style={tableHeaderStyle}>Roll No</th>
                            <th style={tableHeaderStyle}>Admission No</th>
                            <th style={tableHeaderStyle}>Father's Name</th>
                            <th style={tableHeaderStyle}>Mobile No</th>
                            <th style={tableHeaderStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admitDetails.length > 0 ? (
                            admitDetails.map((student) => (
                                <tr key={student.id} style={tableRowStyle}>
                                    <td style={tableCellStyle}>{student.studentName}</td>
                                    <td style={tableCellStyle}>{student.rollNo}</td>
                                    <td style={tableCellStyle}>{student.admissionNo}</td>
                                    <td style={tableCellStyle}>{student.fatherName}</td>
                                    <td style={tableCellStyle}>{student.mobileNo}</td>
                                    <td style={tableCellStyle}>
                                        <div style={actionButtonsStyle}>
                                            <IconButton
                                                size="small"
                                                style={downloadButtonStyle}
                                                onClick={() => handleDownload(student)}
                                                title="Download"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                style={printButtonStyle}
                                                onClick={() => handlePrint(student)}
                                                title="Print"
                                            >
                                                <PrintIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                style={deleteButtonStyle}
                                                onClick={() => showDeleteConfirmation(student.id, student.studentName)}
                                                title="Delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={noDataStyle}>
                                    No admit details found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={confirmation.open}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={handleDeleteConfirm}
                onCancel={handleCloseConfirmation}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

// Component 2: Create New Admit (Second Image Format)
const CreateNewAdmit = () => {
    const [formData, setFormData] = useState({
        examType: '',
        subExam: '',
        session: '2025-2026',
        class: '',
        section: ''
    });

    const [subjectDetails, setSubjectDetails] = useState([
        {
            id: 1,
            subject: 'Mathematics',
            date: '2025-03-15',
            startTime: '09:00',
            endTime: '12:00'
        },
        {
            id: 2,
            subject: 'Science',
            date: '2025-03-16',
            startTime: '09:00',
            endTime: '12:00'
        },
        {
            id: 3,
            subject: 'English',
            date: '2025-03-17',
            startTime: '09:00',
            endTime: '11:00'
        }
    ]);

    const [newSubject, setNewSubject] = useState({
        subject: '',
        date: '',
        startTime: '',
        endTime: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [confirmation, setConfirmation] = useState({
        open: false,
        title: '',
        message: '',
        action: null,
        subjectId: null,
        data: null
    });

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNewSubjectChange = (field, value) => {
        setNewSubject(prev => ({ ...prev, [field]: value }));
    };

    const handleAddSubject = () => {
        if (!newSubject.subject || !newSubject.date || !newSubject.startTime || !newSubject.endTime) {
            setSnackbar({
                open: true,
                message: 'Please fill all subject details',
                severity: 'warning'
            });
            return;
        }

        const newId = subjectDetails.length + 1;
        setSubjectDetails(prev => [...prev, { id: newId, ...newSubject }]);

        setNewSubject({
            subject: '',
            date: '',
            startTime: '',
            endTime: ''
        });

        setSnackbar({
            open: true,
            message: 'Subject added successfully',
            severity: 'success'
        });
    };

    const showDeleteSubjectConfirmation = (id) => {
        setConfirmation({
            open: true,
            title: 'Delete Subject',
            message: 'Are you sure you want to delete this subject?',
            action: 'deleteSubject',
            subjectId: id
        });
    };

    const showCancelConfirmation = () => {
        setConfirmation({
            open: true,
            title: 'Cancel Changes',
            message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
            action: 'cancelForm',
            data: null
        });
    };

    const handleConfirmationConfirm = () => {
        if (confirmation.action === 'deleteSubject') {
            setSubjectDetails(prev => prev.filter(subject => subject.id !== confirmation.subjectId));
            setSnackbar({
                open: true,
                message: 'Subject deleted successfully',
                severity: 'info'
            });
        } else if (confirmation.action === 'cancelForm') {
            setFormData({
                examType: '',
                subExam: '',
                session: '2025-2026',
                class: '',
                section: ''
            });
            setSubjectDetails([]);
            setNewSubject({
                subject: '',
                date: '',
                startTime: '',
                endTime: ''
            });

            setSnackbar({
                open: true,
                message: 'Form reset successfully',
                severity: 'info'
            });
        }

        setConfirmation({ open: false, title: '', message: '', action: null, subjectId: null, data: null });
    };

    const handleSave = () => {
        if (!formData.examType || !formData.class || subjectDetails.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please fill all required fields and add at least one subject',
                severity: 'warning'
            });
            return;
        }

        setSnackbar({
            open: true,
            message: 'Admit card created successfully!',
            severity: 'success'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleCloseConfirmation = () => {
        setConfirmation({ open: false, title: '', message: '', action: null, subjectId: null, data: null });
    };

    return (
        <div style={cardStyle}>
            <h2 style={cardTitleStyle}>ADMIT CARD</h2>

            {/* Form Section */}
            <div style={formContainerStyle}>
                <h3 style={sectionTitleStyle}>CREATE NEW ADMIT</h3>
                <div style={formGridStyle}>
                    <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Exam Type</label>
                        <select
                            style={selectStyle}
                            value={formData.examType}
                            onChange={(e) => handleFormChange('examType', e.target.value)}
                        >
                            <option value="">Select Exam Type</option>
                            <option value="Annual Examination">Annual Examination</option>
                            <option value="Mid-Term Exam">Mid-Term Exam</option>
                            <option value="Unit Test">Unit Test</option>
                            <option value="Final Exam">Final Exam</option>
                        </select>
                    </div>

                    <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Sub Exam</label>
                        <select
                            style={selectStyle}
                            value={formData.subExam}
                            onChange={(e) => handleFormChange('subExam', e.target.value)}
                        >
                            <option value="">Select Sub Exam</option>
                            <option value="Theory">Theory</option>
                            <option value="Practical">Practical</option>
                            <option value="Oral">Oral</option>
                        </select>
                    </div>

                    <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Session</label>
                        <input
                            type="text"
                            style={inputStyle}
                            value={formData.session}
                            readOnly
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Class</label>
                        <select
                            style={selectStyle}
                            value={formData.class}
                            onChange={(e) => handleFormChange('class', e.target.value)}
                        >
                            <option value="">Select Class</option>
                            <option value="10">10th</option>
                            <option value="9">9th</option>
                            <option value="8">8th</option>
                            <option value="7">7th</option>
                            <option value="6">6th</option>
                        </select>
                    </div>

                    <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Section</label>
                        <select
                            style={selectStyle}
                            value={formData.section}
                            onChange={(e) => handleFormChange('section', e.target.value)}
                        >
                            <option value="">Select Section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subject Details Section */}
            <div style={subjectContainerStyle}>
                <h3 style={sectionTitleStyle}>CREATE NEW ADMIT CARD</h3>

                {/* Add Subject Form */}
                <div style={addSubjectFormStyle}>
                    <div style={subjectFormGridStyle}>
                        <div style={subjectFormGroupStyle}>
                            <label style={formLabelStyle}>Subject</label>
                            <input
                                type="text"
                                style={subjectInputStyle}
                                value={newSubject.subject}
                                onChange={(e) => handleNewSubjectChange('subject', e.target.value)}
                                placeholder="Enter subject name"
                            />
                        </div>

                        <div style={subjectFormGroupStyle}>
                            <label style={formLabelStyle}>Date</label>
                            <input
                                type="date"
                                style={subjectInputStyle}
                                value={newSubject.date}
                                onChange={(e) => handleNewSubjectChange('date', e.target.value)}
                            />
                        </div>

                        <div style={subjectFormGroupStyle}>
                            <label style={formLabelStyle}>Start Time</label>
                            <input
                                type="time"
                                style={subjectInputStyle}
                                value={newSubject.startTime}
                                onChange={(e) => handleNewSubjectChange('startTime', e.target.value)}
                            />
                        </div>

                        <div style={subjectFormGroupStyle}>
                            <label style={formLabelStyle}>End Time</label>
                            <input
                                type="time"
                                style={subjectInputStyle}
                                value={newSubject.endTime}
                                onChange={(e) => handleNewSubjectChange('endTime', e.target.value)}
                            />
                        </div>

                        <div style={subjectFormGroupStyle}>
                            <label style={formLabelStyle}>&nbsp;</label>
                            <button
                                style={addSubjectButtonStyle}
                                onClick={handleAddSubject}
                            >
                                <AddIcon style={{ marginRight: '5px' }} />
                                ADD SUBJECT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subjects Table */}
                <div style={subjectTableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Subject</th>
                                <th style={tableHeaderStyle}>Date</th>
                                <th style={tableHeaderStyle}>Start Time</th>
                                <th style={tableHeaderStyle}>End Time</th>
                                <th style={tableHeaderStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectDetails.length > 0 ? (
                                subjectDetails.map((subject) => (
                                    <tr key={subject.id} style={tableRowStyle}>
                                        <td style={tableCellStyle}>{subject.subject}</td>
                                        <td style={tableCellStyle}>{subject.date}</td>
                                        <td style={tableCellStyle}>{subject.startTime}</td>
                                        <td style={tableCellStyle}>{subject.endTime}</td>
                                        <td style={tableCellStyle}>
                                            <IconButton
                                                size="small"
                                                style={deleteButtonStyle}
                                                onClick={() => showDeleteSubjectConfirmation(subject.id)}
                                                title="Delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={noDataStyle}>
                                        No subject details found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={actionContainerStyle}>
                <button
                    style={saveButtonStyle}
                    onClick={handleSave}
                >
                    <SaveIcon style={{ marginRight: '5px' }} />
                    SAVE
                </button>
                <button
                    style={cancelButtonStyle}
                    onClick={showCancelConfirmation}
                >
                    <CancelIcon style={{ marginRight: '5px' }} />
                    CANCEL
                </button>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={confirmation.open}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={handleConfirmationConfirm}
                onCancel={handleCloseConfirmation}
                confirmText={confirmation.action === 'cancelForm' ? 'Yes, Cancel' : 'Delete'}
                cancelText="No"
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

// =============== STYLES ===============

// Confirmation Dialog Styles
const confirmationOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const confirmationDialogStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center'
};

const confirmationTitleStyle = {
    color: '#2c3e50',
    marginBottom: '15px',
    fontSize: '20px',
    fontWeight: 'bold'
};

const confirmationMessageStyle = {
    color: '#6c757d',
    marginBottom: '25px',
    fontSize: '16px',
    lineHeight: '1.5'
};

const confirmationButtonsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px'
};

const confirmButtonStyle = {
    padding: '10px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    minWidth: '100px'
};

confirmButtonStyle[':hover'] = {
    backgroundColor: '#c0392b',
    transform: 'translateY(-1px)'
};

const cancelDialogButtonStyle = {
    padding: '10px 25px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    minWidth: '100px'
};

cancelDialogButtonStyle[':hover'] = {
    backgroundColor: '#545b62',
    transform: 'translateY(-1px)'
};

// Main Container Styles
const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: '20px'
};

const headerStyle = {
    marginBottom: '30px',
    textAlign: 'center'
};

const titleStyle = {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold'
};

const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
};

const tabStyle = {
    padding: '12px 24px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#4a6ee0',
    color: 'white',
    boxShadow: '0 2px 5px rgba(74, 110, 224, 0.3)'
};

// Card Styles
const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px',
    margin: '0 auto'
};

const cardTitleStyle = {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
    borderBottom: '3px solid #4a6ee0',
    paddingBottom: '15px'
};

const sectionTitleStyle = {
    color: '#4a6ee0',
    marginBottom: '20px',
    fontSize: '18px',
    fontWeight: '600'
};

// Filter/Form Styles
const filtersContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #e9ecef'
};

const formContainerStyle = {
    ...filtersContainerStyle
};

const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    alignItems: 'end'
};

const formGridStyle = {
    ...filtersGridStyle
};

const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const formGroupStyle = {
    ...filterGroupStyle
};

const filterLabelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
};

const formLabelStyle = {
    ...filterLabelStyle
};

const selectStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box'
};

const inputStyle = {
    ...selectStyle,
    backgroundColor: '#f8f9fa',
    color: '#6c757d'
};

// Button Styles
const getDetailsButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    width: '100%'
};

getDetailsButtonStyle[':hover'] = {
    backgroundColor: '#3a5ec0'
};

// Table Styles
const tableContainerStyle = {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
};

const tableHeaderStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    borderRight: '1px solid #3a5ec0'
};

const tableRowStyle = {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.2s'
};

tableRowStyle[':hover'] = {
    backgroundColor: '#f8f9fa'
};

const tableCellStyle = {
    padding: '12px 15px',
    borderRight: '1px solid #e9ecef'
};

const noDataStyle = {
    padding: '30px',
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '16px'
};

// Action Buttons
const actionButtonsStyle = {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap'
};

const downloadButtonStyle = {
    color: '#27ae60',
    padding: '5px'
};

const printButtonStyle = {
    color: '#3498db',
    padding: '5px'
};

const deleteButtonStyle = {
    color: '#e74c3c',
    padding: '5px'
};

// Subject Management Styles
const subjectContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #e9ecef'
};

const addSubjectFormStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #dee2e6'
};

const subjectFormGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    alignItems: 'end'
};

const subjectFormGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const subjectInputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box'
};

const addSubjectButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    width: '100%'
};

addSubjectButtonStyle[':hover'] = {
    backgroundColor: '#219653'
};

const subjectTableContainerStyle = {
    ...tableContainerStyle,
    maxHeight: '300px',
    overflowY: 'auto'
};

// Action Container Styles
const actionContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef'
};

const saveButtonStyle = {
    padding: '12px 30px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    minWidth: '150px',
    justifyContent: 'center'
};

saveButtonStyle[':hover'] = {
    backgroundColor: '#219653'
};

const cancelButtonStyle = {
    padding: '12px 30px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    minWidth: '150px',
    justifyContent: 'center'
};

cancelButtonStyle[':hover'] = {
    backgroundColor: '#c0392b'
};

// Add CSS for hover effects
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  select:focus, input:focus {
    outline: none;
    border-color: #4a6ee0;
    box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.2);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .confirmation-dialog {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
document.head.appendChild(styleTag);

export default AdmitCardSystem;