import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import FileUploadStatus from './FileUploadStatus';
import { useNavigate } from 'react-router-dom';


const UpdateDocument = () => {
  const navigate = useNavigate();

  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    authority: '',
    title: '',
    description: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [renamingFile, setRenamingFile] = useState({});

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
     

        const response = await axios.get(`${baseURL}/api/get-document/${documentId}`);
        setDocument(response.data);
        setFormData({
          ...formData,
          authority: response.data.authority || '',
          title: response.data.documentName || '',
          description: response.data.trackDescription || '',
          status: response.data.Status || '',
        });

        const filesResponse = await axios.get(`${baseURL}/api/get-files/${documentId}`);
        const validFiles = filesResponse.data.filter(file => file.filePath);
        setFiles(validFiles);
      } catch (error) {
        console.error('Error fetching document or files:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFilesChange = async (updatedFiles) => {
    try {
      setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const filesResponse = await axios.get(`${baseURL}/api/get-files/${documentId}`);
      const validFiles = filesResponse.data.filter(file => file.filePath);
      setFiles(validFiles);
    } catch (error) {
      console.error('Error updating files:', error.response?.data || error.message);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
        // Gather the updated data including file paths
        const updatedData = {
            dateOfUpdate: formData.date,
            trackDescription: formData.description,
            Status: formData.status,
            authority: formData.authority,
            filePaths: files.map(file => file.filePath), // Get the file paths from the state
        };
console.log(updatedData)
        // Send the updated data to the backend
        await axios.put(`${baseURL}/api/update-document/${documentId}`, updatedData);

        // Fetch the updated document from the backend
        const updatedDocumentResponse = await axios.get(`${baseURL}/api/get-document/${documentId}`);
        setDocument(updatedDocumentResponse.data);
        
        // Update form data with the latest document info
        setFormData({
            ...formData,
            authority: updatedDocumentResponse.data.authority || '',
            title: updatedDocumentResponse.data.documentName || '',
            description: updatedDocumentResponse.data.trackDescription || '',
            status: updatedDocumentResponse.data.Status || '',
        });

        // Show success message
        Swal.fire({
            title: 'Success!',
            text: 'Status updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
        });
        navigate('/trackdocuments');
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        
        // Show error message
        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Error updating document. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};




  const handleFileRenameChange = (fileId, newFileName) => {
    setRenamingFile({ ...renamingFile, [fileId]: newFileName });
  };

  const handleRenameFile = async (fileId) => {
    const newFileName = renamingFile[fileId];
    if (!newFileName) return;
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${baseURL}/api/rename-file/${fileId}`, { newFileName });
      Swal.fire({
        title: 'Success!',
        text: 'File renamed successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setRenamingFile({});
      const updatedFiles = await axios.get(`${baseURL}/api/get-files/${documentId}`);
      const validFiles = updatedFiles.data.filter(file => file.filePath);
      setFiles(validFiles);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error renaming file. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-lg-4 m-xl-4">
      <CCard>
        <CCardHeader className="text-center text-info">
          <h4>Update Document</h4>
        </CCardHeader>
        <CCardBody className="m-lg-4 m-xl-4">
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              name="documentId"
              value={documentId}
              label="Document ID"
              disabled
              className="mb-3"
            />
            <CFormInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              label="Date"
              className="mb-3"
            />
            <CFormSelect
              name="authority"
              value={formData.authority}
              onChange={handleInputChange}
              label="Authority"
              className="mb-3"
            >
              <option value="">Select Authority</option>
              <option value="bbmp">BBMP</option>
              <option value="bda">BDA</option>
              <option value="bmrda">BMRDA</option>
              <option value="pcb">PCB</option>
            </CFormSelect>
            <CFormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              label="Title"
              className="mb-3"
            />
            <CFormInput
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              label="Description"
              className="mb-3"
            />
            <CFormSelect
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
              className="mb-3"
            >
              <option value="">Select Status</option>
              <option value="clarified">Clarification</option>
              <option value="approved">Approved</option>
              <option value="sanctioned">Sanctioned</option>
              <option value="submitted">Submitted</option>
            </CFormSelect>

            <FileUploadStatus
              title="Status Files"
              documentId={documentId}
              status={formData.status} 
              onFilesChange={handleFilesChange}
            />

            <CCol xs={12} className="d-flex justify-content-center">
            <CButton type="submit" color="primary" className="mt-3">
              <FontAwesomeIcon icon={faCheck} /> update
            </CButton>
            </CCol>
           
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateDocument;



