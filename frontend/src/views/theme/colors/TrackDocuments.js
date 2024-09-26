import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { faEdit, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import { useNavigate } from 'react-router-dom';

const TrackDocuments = () => {
  const [trackers, setTrackers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrackers = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
   

        const response = await axios.get(  `${baseURL}/api/get-trackers`);
        const trackersData = response.data;

        console.log('API Response Data:', trackersData);

        const filteredTrackers = trackersData.filter(doc => doc.documentName);

        const uniqueTrackers = Array.from(
          new Map(filteredTrackers.map((tracker) => [tracker.documentId, tracker])).values()
        );

        console.log('Unique Documents:', uniqueTrackers);

        setTrackers(uniqueTrackers);
      } catch (error) {
        console.error('Error fetching trackers:', error);
      }
    };

    fetchTrackers();
  }, []);

  const handleEdit = (tracker) => {
    navigate(`/update-document/${tracker.documentId}`);
  };

  const handleView = async (tracker) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const url = ` ${baseURL}/api/get-files/${tracker.documentId}`;
      console.log('Fetching data from:', url);
      const response = await axios.get(url);
      
      if (response.status === 200) {
        const documentData = response.data;
        console.log('Document Data:', documentData);
  
        const fileDetails = Array.isArray(documentData) 
          ? documentData.map(file => ({
              ...file, 
              filePath: ` ${baseURL}/uploads/${file.filePath}`
            }))
          : [];
  
        console.log('File Details:', fileDetails);
  
        setSelectedFiles(fileDetails);
        setModalData({
          documentId: tracker.documentId,
          documentName: tracker.documentName,
          description: tracker.description,
          belongsTo: tracker.belongsTo,
          contactNo: tracker.contactNo,
          dateOfUpload: tracker.dateOfUpload,
          reason: tracker.reason,
          purpose: tracker.purpose,
          dateOfUpdate: tracker.dateOfUpdate,
          authority: tracker.authority,
          trackDescription: tracker.trackDescription,
          status: tracker.status
        });
        setShowModal(true);
      } else {
        console.error('Error fetching document details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching document details:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleClose = () => setShowModal(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTrackers = trackers.filter((tracker) => {
    return (
      tracker.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracker.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracker.belongsTo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="m-lg-4 m-xl-4">
      <CCard>
        <CCardHeader className="text-center text-info">
          <h4>Track Documents</h4>
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
                <CTableHeaderCell>Document ID</CTableHeaderCell>
                <CTableHeaderCell>Document Name</CTableHeaderCell>
                <CTableHeaderCell>Belongs To</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Authority</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredTrackers.map((tracker) => (
                <CTableRow key={tracker.documentId}>
                  <CTableDataCell>{tracker.documentId}</CTableDataCell>
                  <CTableDataCell>{tracker.documentName || 'No Name'}</CTableDataCell>
                  <CTableDataCell>{tracker.belongsTo}</CTableDataCell>
                  <CTableDataCell style={{ color: 'green' }}>
                    {tracker.Status || 'Not yet updated'}
                  </CTableDataCell>
                  <CTableDataCell style={{ color: 'blue' }}>
                    {tracker.authority || 'Not yet updated'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {/* <CButton
                      color="primary"
                      className="me-2"
                      onClick={() => handleView(tracker)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View
                    </CButton> */}
                    <CButton
                      color="secondary"
                      onClick={() => handleEdit(tracker)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Update
                    </CButton>
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
                <CModalTitle>Associated Files</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {selectedFiles.length > 0 ? (
                  <CTable bordered hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>No.</CTableHeaderCell>
                        <CTableHeaderCell>Document Type</CTableHeaderCell>
                        <CTableHeaderCell>File Path</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
  {selectedFiles
    .filter(file => file.filePath !== 'http://localhost:5000/uploads/undefined')
    .map((file, index) => (
      <CTableRow key={file._id}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>{file.documentType}</CTableDataCell>
        <CTableDataCell>{file.filePath || 'No File Path'}</CTableDataCell>
        <CTableDataCell style={{ color: 'green' }}>{file.Status || ''}</CTableDataCell>
        <CTableDataCell>
          <CButton
            color="primary"
            href={file.filePath}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </CButton>
        </CTableDataCell>
      </CTableRow>
    ))}
</CTableBody>

                  </CTable>
                ) : (
                  <p>No files available.</p>
                )}
              </CModalBody>
            </div>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TrackDocuments;
