import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlinePlus, AiOutlineUpload, AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';
import swal from 'sweetalert';

const FileUploadStatus = ({ title, documentId, onFilesChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [savedFiles, setSavedFiles] = useState([]);
  const [file, setFile] = useState(null); // State to store selected file

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      swal('Invalid file type', 'Please upload a valid file (JPEG, PNG, PDF)', 'error');
    } else if (selectedFile.size > maxSize) {
      swal('File too large', 'Please upload a file smaller than 5 MB', 'error');
    } else {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set the filename to input
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formattedFileName', fileName);
    
    try {
      // First, upload the file
      const baseURL = import.meta.env.VITE_API_BASE_URL;
   

      const response = await axios.post(`${baseURL}/api/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const filePath = response.data.filePath; // Get file path from response
  
      // Save file path to Document
      await axios.post( `${baseURL}/api/document/${documentId}/file-path`, {
        filePath,
      });
  
      // Save file path to Tracker
      await axios.post(`${baseURL}/api/tracker/${documentId}/file-path`, {
        filePath,
      });
  
      // Update the saved files state
      const updatedFiles = [
        ...savedFiles,
        {
          formattedFileName: response.data.fileName,
          file: file,
          filePath: filePath,
        },
      ];
      setSavedFiles(updatedFiles);
      onFilesChange(updatedFiles); // Update the parent component
      setShowModal(false); // Close the modal on successful upload
      setFile(null); // Reset file state
      setFileName(''); // Reset filename
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  const handleViewFile = (file) => {
    if (file.filePath) {
      window.open(`http://localhost:5000/uploads/${file.filePath}`, '_blank');
    } else {
      console.error("File path is undefined.");
    }
  };

  const handleRemoveFile = (formattedFileName) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const updatedFiles = savedFiles.filter(file => file.formattedFileName !== formattedFileName);
        setSavedFiles(updatedFiles);
        onFilesChange(updatedFiles);
        swal("Your file has been deleted!", { icon: "success" });
      } else {
        swal("Your file is safe!");
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">{title}</h5>
        <Button onClick={() => setShowModal(true)} variant="outline-primary">
          <AiOutlinePlus size={24} className="me-2" /> Upload File
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <input
              type="file"
              id="file-upload"
              className="d-none"
              onChange={handleFileChange}
            />
            <Button onClick={() => document.getElementById('file-upload').click()} variant="primary" className="mb-3">
              <AiOutlineUpload className="me-2" /> Choose File
            </Button>
            <Button onClick={handleFileUpload} variant="success">Upload</Button>
          </div>
        </Modal.Body>
      </Modal>

      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savedFiles.map((file, index) => (
            <tr key={index}>
              <td>{file.formattedFileName}</td>
              <td>
                <Button variant="outline-success" className="me-2" onClick={() => handleViewFile(file)}>
                  <AiOutlineEye /> View
                </Button>
                <Button variant="outline-danger" onClick={() => handleRemoveFile(file.formattedFileName)}>
                  <AiOutlineDelete /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileUploadStatus;



