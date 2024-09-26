import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import '@coreui/coreui/dist/css/coreui.min.css';

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({ propertyDocuments: [], otherDocuments: [] });
  const [searchQuery, setSearchQuery] = useState('');

  

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/get-documents`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log(data); // Log fetched data

        const groupedDocs = data.reduce((acc, doc) => {
          if (!acc[doc.documentId]) {
            acc[doc.documentId] = {
              documentId: doc.documentId,
              dateOfUpload: doc.dateOfUpload,
              documentType: doc.documentType,
              documentName: doc.documentName,
              belongsTo: doc.belongsTo,
              contactNo: doc.contactNo,
              propertyDocuments: doc.propertyDocuments || [],
              otherDocuments: doc.otherDocuments || [],
            };
          }

          return acc;
        }, {});

        console.log(Object.values(groupedDocs)); // Log grouped documents

        setDocuments(Object.values(groupedDocs));
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleShow = (files) => {
    const { propertyDocuments, otherDocuments } = files;
    setSelectedFiles({ propertyDocuments, otherDocuments });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDocuments = documents.filter((doc) => {
    return (
      doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.dateOfUpload.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.belongsTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contactNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="m-lg-4 m-xl-4">
      <CCard>
        <CCardHeader className="text-center text-info">
          <h4>View Documents</h4>
        </CCardHeader>
        <CCardBody className="m-lg-4 m-xl-4">
          <div className="d-flex justify-content-end mb-3">
            <CInputGroup style={{ maxWidth: '300px' }}>
              <CFormInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <CInputGroupText>
                <FontAwesomeIcon icon={faSearch} />
              </CInputGroupText>
            </CInputGroup>
          </div>
          <CTable bordered hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Date of Upload</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Belongs To</CTableHeaderCell>
                <CTableHeaderCell>Contact Number</CTableHeaderCell>
                <CTableHeaderCell>View</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredDocuments.slice().reverse().map((doc) => (
                <CTableRow key={doc.documentId}>
                  <CTableDataCell>{doc.documentId}</CTableDataCell>
                  <CTableDataCell>{doc.dateOfUpload}</CTableDataCell>
                  <CTableDataCell>{doc.documentType}</CTableDataCell>
                  <CTableDataCell>{doc.documentName}</CTableDataCell>
                  <CTableDataCell>{doc.belongsTo}</CTableDataCell>
                  <CTableDataCell>{doc.contactNo}</CTableDataCell>
                  <CTableDataCell>
                    {doc.propertyDocuments.length > 0 || doc.otherDocuments.length > 0 ? (
                      <CButton
                        color="primary"
                        onClick={() => handleShow({ propertyDocuments: doc.propertyDocuments, otherDocuments: doc.otherDocuments })}
                      >
                        <FontAwesomeIcon icon={faEye} /> View Files
                      </CButton>
                    ) : (
                      <span>No Files</span>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <CModal
            visible={showModal}
            onClose={handleClose}
            size="lg"
            centered
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: '90vh',
            }}
          >
            <div
              style={{
                maxHeight: '80vh',
                overflowY: 'auto',
                width: '100%',
              }}
            >
              <CModalHeader>
                <CModalTitle>Files</CModalTitle>
              </CModalHeader>
              <CModalBody>
  <h5>Property Documents</h5>
  <CTable>
    <CTableBody>
      {selectedFiles.propertyDocuments.map((link, index) => (
        <CTableRow key={index}>
          <CTableDataCell>{index + 1}</CTableDataCell>
          <CTableDataCell>{link}</CTableDataCell>
          <CTableDataCell className="text-end">
            <CButton
              color="primary"
              onClick={() => {
                const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/${link}`; // Added slash
                console.log(fileUrl); // Log to check the URL
                window.open(fileUrl, '_blank'); // Open the file URL in a new tab
              }}
            >
              <FontAwesomeIcon icon={faEye} /> View
            </CButton>
          </CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>

  {selectedFiles.otherDocuments.length > 0 && ( // Conditional rendering
    <>
      <h5>Other Documents</h5>
      <CTable>
        <CTableBody>
          {selectedFiles.otherDocuments.map((link, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{link}</CTableDataCell>
              <CTableDataCell className="text-end">
                <CButton
                  color="primary"
                  onClick={() => {
                    const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${link}`; // Assuming other documents are in 'uploads' folder
                    console.log(fileUrl); // Log to check the URL
                    window.open(fileUrl, '_blank'); // Open the file URL in a new tab
                  }}
                >
                  <FontAwesomeIcon icon={faEye} /> View
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )}
</CModalBody>

            </div>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ViewDocuments;
