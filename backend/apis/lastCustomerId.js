// routes/lastCustomerId.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Endpoint to get the last customer ID
router.get('/last-customer-id', async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne({}, {}, { sort: { 'customerID': -1 } });
    const lastCustomerID = lastCustomer ? lastCustomer.customerID : 'CUST_000';
    res.json({ lastCustomerID });
  } catch (error) {
    console.error('Error fetching last customer ID:', error);
    res.status(500).json({ error: 'Failed to fetch last customer ID' });
  }
});

module.exports = router;
