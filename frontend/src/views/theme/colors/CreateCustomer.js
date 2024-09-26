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
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Select from 'react-select';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const CreateCustomer = () => {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    customerID: '',
    customerName: '',
    address: '',
    country: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    pan: '',
    primaryName: '',
    primaryPhone: '',
    primaryEmail: '',
    secondaryName: '',
    secondaryPhone: '',
    secondaryEmail: '',
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prevData) => ({ ...prevData, date: today }));
    fetchLastCustomerID();
  }, []);

  const fetchLastCustomerID = async () => {
    

    try {
     
     const baseURL = import.meta.env.VITE_API_BASE_URL;
      

      const response = await fetch(`${baseURL}/api/last-customer-id`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching last customer ID:', errorText);
        return;
      }
      const data = await response.json();
      const lastIDNumber = parseInt(data.lastCustomerID.split('_')[1], 10);
      setFormData((prevData) => ({
        ...prevData,
        customerID: `CUST_${(lastIDNumber + 1).toString().padStart(3, '0')}`,
      }));
    } catch (error) {
      console.error('Error fetching last customer ID:', error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
  
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
       const response = await fetch(`${baseURL}/api/create-customer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to create customer:', errorText);
          alert(`Failed to create customer: ${errorText}`);
          return;
        }
  
        swal("Customer Created successfully!", "", "success");
        generateNextCustomerID();
        handleCancel();
        navigate('/customerlist');
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the customer.');
      }
    }
    setValidated(true);
  };
  
  

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prevData) => ({ ...prevData, [name]: selectedOption.value }));
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customerID: '',
      customerName: '',
      address: '',
      country: '',
      state: '',
      district: '',
      city: '',
      pincode: '',
      pan: '',
      primaryName: '',
      primaryPhone: '',
      primaryEmail: '',
      secondaryName: '',
      secondaryPhone: '',
      secondaryEmail: '',
    });
    fetchLastCustomerID();
    setValidated(false);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const generateNextCustomerID = () => {
    const currentIDNumber = parseInt(formData.customerID.split('_')[1], 10);
    const nextIDNumber = currentIDNumber + 1;
    setFormData((prevData) => ({
      ...prevData,
      customerID: `CUST_${nextIDNumber.toString().padStart(3, '0')}`,
    }));
  };

  const countryOptions = [
    { value: 'india', label: 'India' },
    
  ];

  const stateOptions = [
    { value: 'ka', label: 'Karnataka' },
   
  ];

  const districtOptions = [
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mandya', label: 'Mandya' },
    { value: 'mysore', label: 'Mysore' },
    { value: 'ramanagara', label: 'Ramanagara' },
  ];

  const cityOptions = [
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mandya', label: 'Mandya' },
    { value: 'mysore', label: 'Mysore' },
    { value: 'ramanagara', label: 'Ramanagara' },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      borderColor: '#ced4da',
      minHeight: '38px',
      height: '38px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#ced4da',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'dark',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'dark',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'dark',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '38px',
      padding: '0 6px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '38px',
    }),
  };

  return (
    <div className="">
      <CCard className="m-lg-4 m-xl-4">
        <CCardHeader className="text-center">
          <h4 className="text-info">Create Customer</h4>
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
                id="customerID"
                label="Customer ID"
                value={formData.customerID}
                disabled
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="date"
                id="date"
                label="Date"
                disabled
                required
                value={formData.date}
                onChange={handleInputChange}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                type="text"
                id="customerName"
                label="Customer Name"
                required
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </CCol>

            <CCol md={12}>
              <CFormTextarea
                id="address"
                label="Address"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
            </CCol>

            <CCol md={4}>
              <label htmlFor="countrySelect" className="form-label">
                Country
              </label>
              <Select
                id="countrySelect"
                name="country"
                options={countryOptions}
                classNamePrefix="react-select"
                isSearchable
                placeholder="Choose Country"
                aria-describedby="countryFeedback"
                required
                onChange={handleSelectChange}
                styles={customStyles}
              />
              <div id="countryFeedback" className="invalid-feedback">
                Please select a valid Country.
              </div>
            </CCol>

            <CCol md={4}>
              <label htmlFor="stateSelect" className="form-label">
                State
              </label>
              <Select
                id="stateSelect"
                name="state"
                options={stateOptions}
                classNamePrefix="react-select"
                isSearchable
                placeholder="Choose State"
                aria-describedby="stateFeedback"
                required
                onChange={handleSelectChange}
                styles={customStyles}
              />
              <div id="stateFeedback" className="invalid-feedback">
                Please select a valid State.
              </div>
            </CCol>

            <CCol md={4}>
              <label htmlFor="districtSelect" className="form-label">
                District
              </label>
              <Select
                id="districtSelect"
                name="district"
                options={districtOptions}
                classNamePrefix="react-select"
                isSearchable
                placeholder="Choose District"
                aria-describedby="districtFeedback"
                required
                onChange={handleSelectChange}
                styles={customStyles}
              />
              <div id="districtFeedback" className="invalid-feedback">
                Please select a valid District.
              </div>
            </CCol>

            <CCol md={4}>
              <label htmlFor="citySelect" className="form-label">
                City
              </label>
              <CFormInput
                id="citySelect"
                name="city"
                // options={cityOptions}
                classNamePrefix="react-select"
                isSearchable
                // placeholder="Choose City"
                aria-describedby="cityFeedback"
                required
                onChange={handleSelectChange}
                // styles={customStyles}
              />
              <div id="cityFeedback" className="invalid-feedback">
                Please select a valid City.
              </div>
            </CCol>

            <CCol md={4}>
              <CFormInput
                type="number"
                maxLength={6}
                aria-describedby="pincodeFeedback"
                id="pincode"
                label="Pincode"
                required
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                id="pan"
                label="PAN"
                required
                value={formData.pan}
                onChange={handleInputChange}
              />
            </CCol>

            <CCol md={12}>
              <hr />
            </CCol>
            <h5>Primary Contact</h5>
            <CCol md={4}>
              <CFormInput
                type="text"
                id="primaryName"
                label="Name"
                required
                value={formData.primaryName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="number"
                maxLength={10}
                id="primaryPhone"
                label="Phone"
                required
                pattern="[0-9]{10}"
                value={formData.primaryPhone}
                onChange={handleInputChange}
                className={validatePhoneNumber(formData.primaryPhone) ? '' : ''}
              />
             
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="email"
                id="primaryEmail"
                label="Email"
                required
                value={formData.primaryEmail}
                onChange={handleInputChange}
              />
            </CCol>

            <h5>Secondary Contact</h5>
            <CCol md={4}>
              <CFormInput
                type="text"
                id="secondaryName"
                label="Name"
                required
                value={formData.secondaryName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="number"
                
                id="secondaryPhone"
                label="Phone"
                required
                pattern="[0-9]{10}"
                value={formData.secondaryPhone}
                onChange={handleInputChange}
                className={validatePhoneNumber(formData.secondaryPhone) ? '' : ''}
              />
              <div className="invalid-feedback">
              
              </div>
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="email"
                id="secondaryEmail"
                label="Email"
                required
                value={formData.secondaryEmail}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={12}>
              <hr />
            </CCol>

            <CCol xs={12}>
              <div className="d-flex justify-content-center">
                <CButton color="primary" type="submit" className="me-3">
                  Create
                </CButton>
                <CButton color="secondary" type="button" onClick={handleCancel}>
                  Cancel
                </CButton>
              </div>
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CreateCustomer;
