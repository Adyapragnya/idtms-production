// FileViewerPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FileViewer = () => {
  const { documentId } = useParams();
  const [fileLinks, setFileLinks] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(  `${baseURL}/api/get-document-files/${documentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFileLinks(data.fileLinks || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [documentId]);

  return (
    <div className="container mt-4">
      <h4 className="text-info text-center">File Viewer</h4>
      <div className="tabs">
        <ul className="nav nav-tabs">
          {fileLinks.map((_, index) => (
            <li className="nav-item" key={index}>
              <a className={`nav-link ${index === 0 ? 'active' : ''}`} data-toggle="tab" href={`#tab${index}`}>
                File {index + 1}
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          {fileLinks.map((link, index) => (
            <div id={`tab${index}`} className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} key={index}>
              {link.endsWith('.pdf') ? (
                <iframe src={link} style={{ width: '100%', height: '80vh' }} frameBorder="0" />
              ) : (
                <img src={link} alt={`File ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
