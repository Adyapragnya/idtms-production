import React, { useEffect, useState } from 'react';
import {
  CForm,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CFormTextarea,
  CCol,
  CButton,
  CFormSelect,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import swal from 'sweetalert';
import FileUpload from './FileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCropSimple, faCross, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const StoreDocuments = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    documentId: '',
    documentType: '',
    documentName: '',
    description: '',
    belongsTo: '',
    contactNo: '',
    dateOfUpload: '',
    reason: '',
    purpose: '',
  });
  const [customers, setCustomers] = useState([]);
  const [files, setFiles] = useState([]); // State to store files to be uploaded

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prevData) => ({ ...prevData, dateOfUpload: today }));

    const fetchCustomers = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/get-customers`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched customers:', data);
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchLastDocumentId = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/last-document-id`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const newDocumentId = `DOC_${(parseInt(data.lastDocumentID.split('_')[1], 10) + 1).toString().padStart(3, '0')}`;
        setFormData((prevData) => ({ ...prevData, documentId: newDocumentId }));
      } catch (error) {
        console.error('Error fetching last document ID:', error);
      }
    };

    fetchCustomers();
    fetchLastDocumentId();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
  
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        console.log('Form data before submission:', {
          ...formData,
          filePaths: files.map(file => file.filePath),
        });
        const baseURL = import.meta.env.VITE_API_BASE_URL;
  
        const response = await fetch(     `${baseURL}/api/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            filePaths: files.map(file => file.filePath),
          }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to store document');
        }
      
        const responseData = await response.json();
        console.log('Response from storing document:', responseData);
  
        const uploadPromises = files.map(async (fileData) => {
          const formDataToSend = new FormData();
          formDataToSend.append('file', fileData.file);
          formDataToSend.append('formattedFileName', fileData.formattedFileName);
          formDataToSend.append('documentId', formData.documentId);
          formDataToSend.append('status', 'pending');
  
          const uploadResponse = await fetch(     `${baseURL}/api/upload-docfile`, {
            method: 'POST',
            body: formDataToSend,
          });
  
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(`Upload failed: ${errorData.message || 'Unknown error'}`);
          }
  
          return uploadResponse.json();
        });
  
        const filePaths = await Promise.all(uploadPromises);

        const finalData = {
          ...responseData,
          propertyDocuments: filePaths, // Assuming filePaths contains the paths of uploaded documents
        };
        
        // You might want to send this back to the server if needed
        console.log('Final data to be sent to server:', finalData);
        swal('Document Stored successfully!', '', 'success');
        navigate('/viewdocuments');
        handleCancel();
      } catch (error) {
        console.error('Error:', error);
        swal('An error occurred', error.message || 'Error while storing the document', 'error');
      }
    }
    setValidated(true);
  };
  
  
  
  
  


  
  
  
  
  
  

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    // Update contact number when belongsTo changes
    if (id === 'belongsTo') {
      const selectedCustomer = customers.find(customer => customer.customerName === value);
      if (selectedCustomer) {
        setFormData((prevData) => ({
          ...prevData,
          contactNo: selectedCustomer.primaryPhone || '',
        }));
      }
    }
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles); // Update the state with the files to be uploaded
  };

  const handleCancel = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      documentId: '',
      documentType: '',
      documentName: '',
      description: '',
      belongsTo: '',
      contactNo: '',
      dateOfUpload: today,
      reason: '',
      purpose: '',
    });
    setFiles([]); // Clear the files on cancel
    setValidated(false);
  };

  return (
    <div className="">
      <CCard className="m-lg-4 m-xl-4">
        <CCardHeader className="text-center">
          <h4 className="text-info">Store Document</h4>
        </CCardHeader>
        <CCardBody className="m-lg-4 m-xl-4">
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={6}>
              <CFormInput
                type="text"
                id="documentId"
                label="Document ID"
                required
                disabled
                value={formData.documentId}
                readOnly
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="date"
                id="dateOfUpload"
                label="Date of Upload"
                required
                disabled
                value={formData.dateOfUpload}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="documentType"
                label="Document Type"
                required
                value={formData.documentType}
                onChange={handleInputChange}
              >
                <option value="">Select Type</option>
                <option value="Invoice">Invoice</option>
                <option value="Receipt">Receipt</option>
                <option value="Property Document">Property Document</option>
                <option value="Others">Others</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                id="documentName"
                label="Document Name"
                required
                value={formData.documentName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="belongsTo"
                label="Belongs To"
                required
                value={formData.belongsTo}
                onChange={handleInputChange}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.customerName}>
                    {customer.customerName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                id="contactNo"
                label="Contact Number"
                required
                value={formData.contactNo}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={12}>
              <CFormTextarea
                id="description"
                label="Description"
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                id="reason"
                label="Reason"
                required
                value={formData.reason}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                id="purpose"
                label="Purpose"
                required
                value={formData.purpose}
                onChange={handleInputChange}
              />
            </CCol>

            <CCol md={12}>
              <hr />
            </CCol>

            <FileUpload
  title="Property Documents"
  documentId={formData.documentId}  // Ensure this is passed correctly
  onFilesChange={handleFilesChange}
/>

            <CCol xs={12} className="d-flex justify-content-center">
              <CButton type="submit" color="primary" className="me-2">  <FontAwesomeIcon icon={faCheck} className="text-white"/> Submit</CButton>
              <CButton type="button" color="secondary" onClick={handleCancel}>  <FontAwesomeIcon icon={faXmarkCircle} className="text-white"/> Cancel</CButton>
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StoreDocuments;