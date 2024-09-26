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
  CInputGroup,
  CFormInput,
  CInputGroupText
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons';
import '@coreui/coreui/dist/css/coreui.min.css'; // Ensure CoreUI CSS is imported

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/customers`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customerID.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.pincode.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.primaryPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.primaryEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="m-lg-4 m-xl-4">
      <CCard>
        <CCardHeader className="text-center text-info">
          <h4>Customer List</h4>
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
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Pincode</CTableHeaderCell>
                <CTableHeaderCell>PAN</CTableHeaderCell>
                <CTableHeaderCell>Primary Contact</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCustomers.map((customer) => (
                <CTableRow key={customer.customerID}>
                  <CTableDataCell>{customer.customerID}</CTableDataCell>
                  <CTableDataCell>{customer.date}</CTableDataCell>
                  <CTableDataCell>{customer.customerName}</CTableDataCell>
                  <CTableDataCell>{customer.address}</CTableDataCell>
                  <CTableDataCell>{customer.pincode}</CTableDataCell>
                  <CTableDataCell>{customer.pan}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex flex-column align-items-start">
                      <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon className="text-gray-500 me-2" icon={faPhone} />
                        <span>{customer.primaryPhone}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon className="text-gray-500 me-2" icon={faEnvelope} />
                        <a href={`mailto:${customer.primaryEmail}`} className="text-decoration-none text-primary">
                          {customer.primaryEmail}
                        </a>
                      </div>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CustomerList;
