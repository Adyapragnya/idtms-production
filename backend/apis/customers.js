// routes/customers.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/customer'); // Adjust path as needed

router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ message: 'Customer created successfully!', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

module.exports = router;
