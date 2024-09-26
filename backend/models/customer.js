// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerID: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  pan: { type: String, required: true },
  primaryName: { type: String, required: true },
  primaryPhone: { type: String, required: true },
  primaryEmail: { type: String, required: true },
  secondaryName: { type: String },
  secondaryPhone: { type: String },
  secondaryEmail: { type: String },
});

module.exports = mongoose.model('Customer', customerSchema);
