const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const app = express();
app.use(cors());
app.use(express.json());

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const formattedFileName = req.body.formattedFileName || file.originalname;
    cb(null, formattedFileName); // Set the file name
  },
});




const upload = multer({ dest: 'uploads/' }); // Ensure this directory is writable

app.post('/api/upload-file', upload.single('file'), (req, res) => {
  console.log(req.body); // Check this
  console.log(req.file);  // Check this

  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
  }

  const formattedFileName = req.body.formattedFileName || req.file.originalname;

  const fs = require('fs');
  const path = require('path');

  const tempPath = req.file.path;
  const newPath = path.join('uploads', formattedFileName + path.extname(req.file.originalname));

  fs.rename(tempPath, newPath, (err) => {
      if (err) return res.status(500).json({ message: 'File rename failed.', error: err });

      // Return the fileName and filePath in the response
      res.json({ 
          message: 'File uploaded and renamed successfully.', 
          fileName: formattedFileName,
          filePath: formattedFileName + path.extname(req.file.originalname) // Include the file path
      });
  });
});

// POST route to save file path in Document
app.post('/api/document/:documentId/file-path', async (req, res) => {
  const { documentId } = req.params;
  const { filePath } = req.body; // Get filePath from request body

  try {
    await Document.updateOne(
      { documentId },
      { $push: { otherDocuments: filePath } }
    );

    res.status(200).json({ message: 'File path saved to Document' });
  } catch (error) {
    console.error('Error saving file path to Document:', error);
    res.status(500).json({ message: 'Error saving file path to Document' });
  }
});

// POST route to save file path in Tracker
app.post('/api/tracker/:documentId/file-path', async (req, res) => {
  const { documentId } = req.params;
  const { filePath } = req.body; // Get filePath from request body

  try {
    await Tracker.updateOne(
      { documentId },
      { $push: { otherDocuments: filePath } }
    );

    res.status(200).json({ message: 'File path saved to Tracker' });
  } catch (error) {
    console.error('Error saving file path to Tracker:', error);
    res.status(500).json({ message: 'Error saving file path to Tracker' });
  }
});



mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("mongodb connected sucessfully"))
.catch(err => console.error('mongodb connection error:' , err));

// Define schemas and models
const customerSchema = new mongoose.Schema({
  date: String,
  customerID: String,
  customerName: String,
  address: String,
  country:String,
  state:String,
  district:String,
  city:String,
  pincode: String,
  pan: String,
  primaryName: String,
  primaryPhone: String,
  primaryEmail: String,
  secondaryName: String,
  secondaryPhone: String,
  secondaryEmail: String,
});

const Customer = mongoose.model('Customer', customerSchema);

const documentSchema = new mongoose.Schema({
  documentId: String,
  documentType: String,
  documentName: String,
  description: String,
  belongsTo: String,
  contactNo: String,
  dateOfUpload: Date,
  reason: String,
  purpose: String,
  propertyDocuments: [String], // Array of file paths
  otherDocuments: [String], 
});

const Document = mongoose.model('Document', documentSchema);

const trackerSchema = new mongoose.Schema({
  documentId: String,
  documentType: String,
  documentName: String,
  description: String,
  belongsTo: String,
  contactNo: String,
  dateOfUpload: String,
  reason: String,
  purpose: String,
  propertyDocuments: [String], // Array of file paths
  otherDocuments: [String], 
  dateOfUpdate: String,
  authority: String,
  trackDescription: String,
  Status: String,
});

const Tracker = mongoose.model('Tracker', trackerSchema);

app.post('/api/upload-docfile', upload.single('file'), async (req, res) => {
  console.log('Upload document file endpoint hit');
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  try {
      const { formattedFileName, documentId, status } = req.body;
      const file = req.file;

      if (!file || !formattedFileName || !documentId || !status) {
          console.log('Missing required fields:', { file, formattedFileName, documentId, status });
          return res.status(400).json({ message: 'File, formattedFileName, documentId, and status are required.' });
      }

      // Use the formattedFileName for renaming
      const fs = require('fs');
      const path = require('path');

      const tempPath = file.path;
      const newFileName = formattedFileName + path.extname(file.originalname);
      const newPath = path.join('uploads', newFileName);

      fs.rename(tempPath, newPath, async (err) => {
          if (err) {
              console.error('File rename failed:', err);
              return res.status(500).json({ message: 'File rename failed.', error: err });
          }

          // Find or create a document
          let document = await Document.findOne({ documentId });
          if (!document) {
              console.log('Creating new document');
              document = new Document({
                  documentId,
                  documentType: file.mimetype,
                  documentName: formattedFileName,
                  propertyDocuments: [newPath], // Store the renamed file path
              });
          } else {
              console.log('Updating existing document');
              document.propertyDocuments.push(newPath);
          }

          await document.save();
          console.log('Document saved successfully:', document); // Log the saved document

          // Find or create a tracker entry
          let trackerEntry = await Tracker.findOne({ documentId });
          if (!trackerEntry) {
              console.log('Creating new tracker entry');
              trackerEntry = new Tracker({
                  documentId,
                  documentType: file.mimetype,
                  documentName: formattedFileName,
                  propertyDocuments: [newPath],
                  Status: status,
              });
          } else {
              console.log('Updating existing tracker entry');
              trackerEntry.propertyDocuments.push(newPath);
              trackerEntry.Status = status;
          }

          await trackerEntry.save();
          console.log('Tracker saved successfully:', trackerEntry); // Log the saved tracker

          res.status(200).json({
              formattedFileName,
              file,
              documentId,
          });
      });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file', details: error.message });
  }
});






// API routes
app.post('/api/upload-statusfile', upload.single('file'), async (req, res) => {
  try {
    const { documentId, fileName, status } = req.body; // Ensure status is included
    const file = req.file;

    if (!file || !documentId || !fileName) {
      return res.status(400).json({ message: 'File, documentId, and fileName are required.' });
    }

    const documentData = {
      documentId,
      documentType: file.mimetype,
      documentName: fileName,
      filePath: path.basename(file.path),
    };

    const newDocument = new Document({
    ...documentData,
    Status: status,
    });
    await newDocument.save();

    // Save to Tracker collection with status
    const newTracker = new Tracker({
      ...documentData,
      Status: status,  // Include status here
    });
    await newTracker.save();

    res.status(200).json({
      formattedFileName: fileName,
      file: file,
      documentId: documentId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', details: error.message });
  }
});


app.post('/api/create-customer', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({ error: 'Error creating customer', details: error.message });
  }
});


app.get('/api/last-customer-id', async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne().sort({ _id: -1 }).exec();
    const lastCustomerID = lastCustomer ? lastCustomer.customerID : 'CUST_000';
    res.json({ lastCustomerID });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching last customer ID' });
  }
});

app.get('/api/last-document-id', async (req, res) => {
  try {
    const lastDocument = await Document.findOne().sort({ _id: -1 }).exec();
    const lastDocumentID = lastDocument ? lastDocument.documentId : 'DOC_000';
    res.json({ lastDocumentID });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching last document ID' });
  }
});

app.get('/api/get-customers', async (req, res) => {
  try {
    const customers = await Customer.find().select('customerName primaryPhone');
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Error fetching customers', details: error.message });
  }
});



app.post('/api/documents', async (req, res) => {
  try {
    const documentData = req.body;

    // Save the document data in the Document collection
    const newDocument = new Document(documentData);
    await newDocument.save();

    // Create the tracker object with additional empty fields
    const trackerData = {
      ...documentData,
      dateOfUpdate: "",        // Empty string for dateOfUpdate
      authority: "",
      trackDescription: "",    // Empty string for trackDescription
      Status: ""               // Empty string for Status
    };

    // Save the same data in the Tracker collection
    const newTrackerEntry = new Tracker(trackerData);
    await newTrackerEntry.save();

    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error storing document:', error);
    res.status(500).json({ error: 'Error storing document', details: error.message });
  }
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/get-documents', async (req, res) => {
  try {
    const documents = await Document.find();
  
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Error fetching documents', details: error.message });
  }
});

app.get('/api/get-document/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Tracker.findOne({ documentId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Error fetching document', details: error.message });
  }
});




app.get('/api/get-trackers', async (req, res) => {
  try {
    const trackers = await Tracker.find({
      belongsTo: { $exists: true, $ne: null }
    }).select({
      documentId: 1,
      documentType: 1,
      documentName: 1,
      description: 1,
      belongsTo: 1,
      contactNo: 1,
      dateOfUpload: 1,
      reason: 1,
      purpose: 1,
      dateOfUpdate: 1,
      authority: 1,
      trackDescription: 1,
      Status: 1,
    });
    res.status(200).json(trackers);
  } catch (error) {
    console.error('Error fetching trackers:', error);
    res.status(500).json({ error: 'Error fetching trackers', details: error.message });
  }
});


app.get('/api/get-files/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    // Find documents with specified documentId, without file type restriction
    const files = await Tracker.find({ documentId });

    if (!files.length) {
      return res.status(404).json({ message: 'No files found for the given document ID' });
    }

    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Error fetching files', details: error.message });
  }
});



app.put('/api/update-document/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const updatedData = req.body;
    
    const result = await Tracker.findOneAndUpdate(
      { documentId: documentId },
      updatedData,
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.put('/update-other-documents/:documentId', (req, res) => {
  const { documentId } = req.params;
  const newFilePaths = req.body.filePaths; // Assuming filePaths is an array of new file paths to add

  // Check if the provided file paths are valid
  if (!newFilePaths || !Array.isArray(newFilePaths)) {
    return res.status(400).send('Invalid file paths');
  }

  // Update the Document's otherDocuments field by pushing the new file paths
  Document.findOneAndUpdate(
    { documentId }, // Filter by documentId
    { $push: { otherDocuments: { $each: newFilePaths } } }, // Add new file paths to otherDocuments array
    { new: true } // Return the updated document
  )
    .then(updatedDocument => {
      if (!updatedDocument) {
        return res.status(404).send('Document not found');
      }
      res.status(200).send(`Updated otherDocuments field: ${updatedDocument.otherDocuments}`);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error updating document');
    });
});





const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

