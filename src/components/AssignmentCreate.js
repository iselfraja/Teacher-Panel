// AssignmentCreate.js - With Notification System
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignmentCreate = () => {
    const [formData, setFormData] = useState({
        class: '',
        section: '',
        subject: '',
        creationDate: '12/26/2025',
        submissionDate: '',
        details: '',
        files: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const classes = ['Select Class', 'Nur', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    const sections = ['Select Section', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const subjects = ['Select Subject', 'Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Art', 'Music', 'Physical Education'];

    // Notification functions
    const showSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    };

    const showError = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    };

    const showInfo = (message) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    };

    const showConfirmation = () => {
        return toast.info(
            <div>
                <p style={{ marginBottom: '10px' }}>Are you sure you want to reset the form?</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => {
                            toast.dismiss();
                            handleResetConfirm();
                        }}
                        style={{
                            padding: '5px 15px',
                            backgroundColor: '#4a6ee0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        style={{
                            padding: '5px 15px',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Show info notification for date changes
        if (name === 'submissionDate' && value) {
            const formattedDate = new Date(value).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            showInfo(`Submission date set to: ${formattedDate}`);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            showError(`Invalid file type(s). Please upload only PDF, JPEG, JPG, or PNG files.`);
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        const oversizedFiles = files.filter(file => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            showError(`Some files exceed 5MB size limit.`);
            return;
        }

        setFormData(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));

        showSuccess(`${files.length} file(s) added successfully!`);
    };

    const handleRemoveFile = (index) => {
        const fileName = formData.files[index].name;
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
        showInfo(`File "${fileName}" removed`);
    };

    const validateForm = () => {
        if (formData.class === '' || formData.class === 'Select Class') {
            showError('Please select a class');
            return false;
        }
        if (formData.section === '' || formData.section === 'Select Section') {
            showError('Please select a section');
            return false;
        }
        if (formData.subject === '' || formData.subject === 'Select Subject') {
            showError('Please select a subject');
            return false;
        }
        if (!formData.submissionDate) {
            showError('Please select a submission date');
            return false;
        }

        // Check if submission date is in the future
        const submissionDate = new Date(formData.submissionDate);
        const today = new Date();
        if (submissionDate <= today) {
            showError('Submission date must be in the future');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Assignment created:', formData);

            // Show success notification
            showSuccess(`Assignment created successfully for ${formData.class} - ${formData.section}!`);

            // Reset form
            setFormData({
                class: '',
                section: '',
                subject: '',
                creationDate: '12/26/2025',
                submissionDate: '',
                details: '',
                files: []
            });

        } catch (error) {
            showError('Failed to create assignment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        // Check if form has data before resetting
        const hasData = formData.class || formData.section || formData.subject ||
            formData.submissionDate || formData.details || formData.files.length > 0;

        if (hasData) {
            showConfirmation();
        } else {
            showInfo('Form is already empty');
        }
    };

    const handleResetConfirm = () => {
        setFormData({
            class: '',
            section: '',
            subject: '',
            creationDate: '12/26/2025',
            submissionDate: '',
            details: '',
            files: []
        });
        showInfo('Form reset successfully');
    };

    // Styles
    const containerStyle = {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        position: 'relative'
    };

    const titleStyle = {
        color: '#2c3e50',
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '25px',
        borderBottom: '2px solid #4a6ee0',
        paddingBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const formGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
        marginBottom: '25px'
    };

    const formGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '5px'
    };

    const inputStyle = {
        padding: '12px 15px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        backgroundColor: 'white',
        width: '100%',
        boxSizing: 'border-box'
    };

    const selectStyle = {
        ...inputStyle,
        cursor: 'pointer'
    };

    const textareaStyle = {
        padding: '12px 15px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        backgroundColor: 'white',
        width: '100%',
        minHeight: '120px',
        resize: 'vertical',
        boxSizing: 'border-box',
        fontFamily: 'inherit'
    };

    const fileUploadStyle = {
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '25px',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '5px'
    };

    const fileInputStyle = {
        display: 'none'
    };

    const fileLabelStyle = {
        display: 'inline-block',
        backgroundColor: '#4a6ee0',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '15px',
        transition: 'all 0.3s'
    };

    const fileListStyle = {
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const fileItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '14px'
    };

    const removeFileStyle = {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    };

    const buttonGroupStyle = {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
    };

    const submitButtonStyle = {
        backgroundColor: isSubmitting ? '#93c5fd' : '#4a6ee0',
        color: 'white',
        border: 'none',
        padding: '14px 40px',
        borderRadius: '8px',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        minWidth: '200px',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        opacity: isSubmitting ? 0.7 : 1
    };

    const resetButtonStyle = {
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        padding: '14px 40px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        minWidth: '200px',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    };

    const requiredStyle = {
        color: '#ef4444',
        marginLeft: '4px'
    };

    const dateGridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        width: '100%'
    };

    const statusIndicatorStyle = {
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: '#f3f4f6',
        color: '#6b7280'
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div style={containerStyle}>
                {isSubmitting && (
                    <div style={statusIndicatorStyle}>
                        ⏳ Creating Assignment...
                    </div>
                )}

                <h2 style={titleStyle}>Create Assignment</h2>

                <form onSubmit={handleSubmit}>
                    <div style={formGridStyle}>
                        {/* Class Selection */}
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Class <span style={requiredStyle}>*</span>
                            </label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                style={selectStyle}
                                required
                            >
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Section <span style={requiredStyle}>*</span>
                            </label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleInputChange}
                                style={selectStyle}
                                required
                            >
                                {sections.map(sec => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Subject <span style={requiredStyle}>*</span>
                            </label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                style={selectStyle}
                                required
                            >
                                {subjects.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        {/* File Upload Section */}
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Upload Files (PDF, JPEG, PNG, JPG):</label>
                            <div style={fileUploadStyle}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    style={fileInputStyle}
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="file-upload"
                                    style={{
                                        ...fileLabelStyle,
                                        opacity: isSubmitting ? 0.6 : 1,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    📁 Choose files
                                </label>
                                <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '10px' }}>
                                    {formData.files.length > 0
                                        ? `${formData.files.length} file(s) selected`
                                        : 'No file chosen'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
                                    Max size: 5MB per file
                                </div>
                            </div>

                            {formData.files.length > 0 && (
                                <div style={fileListStyle}>
                                    {formData.files.map((file, index) => (
                                        <div key={index} style={fileItemStyle}>
                                            <span>📄 {file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                style={removeFileStyle}
                                                disabled={isSubmitting}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dates */}
                        <div style={dateGridStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>
                                    Creation Date <span style={requiredStyle}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="creationDate"
                                    value={formData.creationDate}
                                    style={inputStyle}
                                    readOnly
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>
                                    Submission Date <span style={requiredStyle}>*</span>
                                </label>
                                <input
                                    type="date"
                                    name="submissionDate"
                                    value={formData.submissionDate}
                                    onChange={handleInputChange}
                                    style={inputStyle}
                                    required
                                    disabled={isSubmitting}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Details:</label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                placeholder="Enter assignment details, instructions, or description..."
                                style={textareaStyle}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div style={buttonGroupStyle}>
                        <button
                            type="submit"
                            style={submitButtonStyle}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>⏳ Processing...</>
                            ) : (
                                <>📋 CREATE ASSIGNMENT</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            style={resetButtonStyle}
                            disabled={isSubmitting}
                        >
                            🔄 RESET
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AssignmentCreate;