import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineUpload, AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import swal from 'sweetalert';

const FileUpload = ({ title, documentId, onFilesChange }) => {
  const [fileName, setFileName] = useState('');
  const [savedFiles, setSavedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null); // Initialize file state

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
      setFileName(selectedFile.name); // Optionally set the filename to the input
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formattedFileName', fileName);

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/api/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);

      // Update the saved files state
      const updatedFiles = [
        ...savedFiles,
        {
          formattedFileName: response.data.fileName,
          file: file,
          filePath: response.data.filePath,
        },
      ];
      setSavedFiles(updatedFiles);
      onFilesChange(updatedFiles); // Update the parent component

      // Clear the file input and filename
      setFile(null);
      setFileName('');
      setShowModal(false); // Close the modal on successful upload

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleViewFile = (file) => {
    if (file.filePath) {
      // Use the filePath to open the file
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
        <Button
          onClick={() => setShowModal(true)}
          variant="outline-primary"
          className="d-flex align-items-center"
        >
          <AiOutlinePlus size={24} className="me-2" />
          Add File
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
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
                <Button
                  variant="outline-success"
                  className="me-2"
                  onClick={() => handleViewFile(file)}
                >
                  <AiOutlineEye /> View
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveFile(file.formattedFileName)}
                >
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

export default FileUpload;
