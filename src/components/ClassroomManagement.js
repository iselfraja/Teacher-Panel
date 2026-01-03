import React, { useState } from 'react';

const ClassroomManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    // Form state
    const [formData, setFormData] = useState({
        className: '',
        maxLecture: '',
        minAge: '',
        maxAge: ''
    });

    const containerStyle = {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        minHeight: '600px'
    };

    const titleStyle = {
        color: '#2c3e50',
        marginBottom: '20px',
        borderBottom: '2px solid #4a6ee0',
        paddingBottom: '10px'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    };

    const thStyle = {
        backgroundColor: '#f8f9fa',
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #dee2e6',
        color: '#2c3e50'
    };

    const tdStyle = {
        padding: '12px',
        borderBottom: '1px solid #dee2e6',
        verticalAlign: 'middle'
    };

    const searchBoxStyle = {
        padding: '8px 12px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginRight: '10px',
        width: '200px',
        fontSize: '14px'
    };

    const selectStyle = {
        padding: '8px 12px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        marginRight: '10px',
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginBottom: '15px',
        fontSize: '14px',
        boxSizing: 'border-box'
    };

    const formContainerStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const formStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)'
    };

    const snackbarStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: '600',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 0.3s ease'
    };

    // Initial classes data
    const [classesData, setClassesData] = useState([
        { id: 1, className: 'Nur', maxLecture: 4, minAge: 5, maxAge: 8 },
        { id: 2, className: 'LKG', maxLecture: 4, minAge: 4, maxAge: 6 },
        { id: 3, className: 'UKG', maxLecture: 4, minAge: 5, maxAge: 7 },
        { id: 4, className: '1', maxLecture: 4, minAge: 6, maxAge: 8 },
        { id: 5, className: '2', maxLecture: 4, minAge: 6, maxAge: 8 },
        { id: 6, className: '3', maxLecture: 5, minAge: 7, maxAge: 9 },
        { id: 7, className: '4', maxLecture: 5, minAge: 8, maxAge: 10 },
        { id: 8, className: '5', maxLecture: 5, minAge: 9, maxAge: 11 },
        { id: 9, className: '6', maxLecture: 6, minAge: 10, maxAge: 12 },
        { id: 10, className: '7', maxLecture: 6, minAge: 11, maxAge: 13 }
    ]);

    // Filter classes based on search term
    const filteredClasses = classesData.filter(cls =>
        cls.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentClasses = filteredClasses.slice(startIndex, endIndex);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const showSnackbar = (message, type) => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => {
            setSnackbar({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleAddNew = () => {
        setEditingClass(null);
        setFormData({
            className: '',
            maxLecture: '',
            minAge: '',
            maxAge: ''
        });
        setShowForm(true);
    };

    const handleEdit = (cls) => {
        setEditingClass(cls);
        setFormData({
            className: cls.className,
            maxLecture: cls.maxLecture,
            minAge: cls.minAge,
            maxAge: cls.maxAge
        });
        setShowForm(true);
    };

    const handleDeleteClick = (id) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = () => {
        const updatedClasses = classesData.filter(cls => cls.id !== showDeleteConfirm);
        setClassesData(updatedClasses);
        showSnackbar('Class deleted successfully!', 'error');
        setShowDeleteConfirm(null);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!formData.className || !formData.maxLecture || !formData.minAge || !formData.maxAge) {
            showSnackbar('Please fill all fields!', 'warning');
            return;
        }

        if (parseInt(formData.minAge) >= parseInt(formData.maxAge)) {
            showSnackbar('Min Age must be less than Max Age!', 'warning');
            return;
        }

        if (parseInt(formData.minAge) < 1 || parseInt(formData.maxAge) > 20) {
            showSnackbar('Age must be between 1 and 20!', 'warning');
            return;
        }

        if (editingClass) {
            // Update existing class
            const updatedClasses = classesData.map(cls =>
                cls.id === editingClass.id
                    ? {
                        ...cls,
                        className: formData.className,
                        maxLecture: parseInt(formData.maxLecture),
                        minAge: parseInt(formData.minAge),
                        maxAge: parseInt(formData.maxAge)
                    }
                    : cls
            );
            setClassesData(updatedClasses);
            showSnackbar('Class updated successfully!', 'success');
        } else {
            // Add new class
            const newClass = {
                id: classesData.length > 0 ? Math.max(...classesData.map(c => c.id)) + 1 : 1,
                className: formData.className,
                maxLecture: parseInt(formData.maxLecture),
                minAge: parseInt(formData.minAge),
                maxAge: parseInt(formData.maxAge)
            };
            setClassesData([...classesData, newClass]);
            showSnackbar('Class added successfully!', 'success');
        }

        setShowForm(false);
        setFormData({
            className: '',
            maxLecture: '',
            minAge: '',
            maxAge: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingClass(null);
    };

    // Icons as SVG or text
    const EditIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
    );

    const DeleteIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
    );

    const AddIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
    );

    const SuccessIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
    );

    const ErrorIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
    );

    const WarningIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
    );

    return (
        <>
            <div style={containerStyle}>
                <h2 style={titleStyle}>Class Details</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', fontWeight: '600' }}>Search by Class Name</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            style={searchBoxStyle}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={buttonStyle} onClick={handleAddNew}>
                            <AddIcon />
                            <span style={{ marginLeft: '5px' }}>Add New Class</span>
                        </button>
                    </div>
                </div>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>S.NO</th>
                            <th style={thStyle}>Class</th>
                            <th style={thStyle}>Max Lecture</th>
                            <th style={thStyle}>Min Age</th>
                            <th style={thStyle}>Max Age</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClasses.length > 0 ? (
                            currentClasses.map((cls, index) => (
                                <tr key={cls.id}>
                                    <td style={tdStyle}>{startIndex + index + 1}</td>
                                    <td style={tdStyle}>{cls.className}</td>
                                    <td style={tdStyle}>{cls.maxLecture}</td>
                                    <td style={tdStyle}>{cls.minAge}</td>
                                    <td style={tdStyle}>{cls.maxAge}</td>
                                    <td style={{ ...tdStyle, display: 'flex', gap: '5px' }}>
                                        <button
                                            style={{ ...iconButtonStyle, backgroundColor: '#3498db' }}
                                            onClick={() => handleEdit(cls)}
                                            title="Edit"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            style={{ ...iconButtonStyle, backgroundColor: '#e74c3c' }}
                                            onClick={() => handleDeleteClick(cls.id)}
                                            title="Delete"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                                    No classes found. Try a different search or add a new class.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination and Rows per page - UPDATED STRUCTURE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>Rows per page</span>
                        <select
                            style={selectStyle}
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* NEW PAGINATION STRUCTURE: Page X of Y PREV NEXT */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                                style={{
                                    ...paginationButtonStyle,
                                    backgroundColor: currentPage === 1 ? '#bdc3c7' : '#4a6ee0',
                                    marginRight: '5px'
                                }}
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                PREV
                            </button>
                            <button
                                style={{
                                    ...paginationButtonStyle,
                                    backgroundColor: currentPage === totalPages ? '#bdc3c7' : '#4a6ee0'
                                }}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                NEXT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div style={formContainerStyle}>
                        <div style={{ ...formStyle, width: '350px' }}>
                            <h3 style={{ marginBottom: '20px', color: '#e74c3c' }}>Confirm Delete</h3>
                            <p style={{ marginBottom: '25px' }}>
                                Are you sure you want to delete this class? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#95a5a6', padding: '8px 20px' }}
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#e74c3c', padding: '8px 20px' }}
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div style={formContainerStyle}>
                    <div style={formStyle}>
                        <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                            {editingClass ? 'Edit Class' : 'Add New Class'}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Class Name *</label>
                                <input
                                    type="text"
                                    name="className"
                                    placeholder="Enter class name"
                                    style={inputStyle}
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Max Lecture *</label>
                                <input
                                    type="number"
                                    name="maxLecture"
                                    placeholder="Enter max lectures"
                                    style={inputStyle}
                                    value={formData.maxLecture}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="10"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Min Age *</label>
                                    <input
                                        type="number"
                                        name="minAge"
                                        placeholder="Min age"
                                        style={inputStyle}
                                        value={formData.minAge}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="20"
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Max Age *</label>
                                    <input
                                        type="number"
                                        name="maxAge"
                                        placeholder="Max age"
                                        style={inputStyle}
                                        value={formData.maxAge}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="20"
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    style={{ ...buttonStyle, backgroundColor: '#95a5a6', padding: '10px 25px' }}
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ ...buttonStyle, backgroundColor: '#2ecc71', padding: '10px 25px' }}
                                >
                                    {editingClass ? 'Update' : 'Add'} Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Snackbar Notification */}
            {snackbar.show && (
                <div style={{
                    ...snackbarStyle,
                    backgroundColor: snackbar.type === 'success' ? '#2ecc71' :
                        snackbar.type === 'error' ? '#e74c3c' :
                            snackbar.type === 'warning' ? '#f39c12' : '#3498db'
                }}>
                    {snackbar.type === 'success' && <SuccessIcon />}
                    {snackbar.type === 'error' && <ErrorIcon />}
                    {snackbar.type === 'warning' && <WarningIcon />}
                    {snackbar.message}
                </div>
            )}

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
                
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                
                button:active {
                    transform: translateY(0);
                }

                button:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: #4a6ee0;
                    box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.2);
                }
                `}
            </style>
        </>
    );
};

const buttonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const paginationButtonStyle = {
    backgroundColor: '#4a6ee0',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    minWidth: '80px'
};

const iconButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '35px',
    height: '35px'
};

export default ClassroomManagement;