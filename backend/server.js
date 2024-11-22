const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
// const uri = 'mongodb+srv://dikshakushwahqa:MFqewJQ0VRT4aI3F@cluster0.5jmix.mongodb.net/formData';
const uri = 'mongodb+srv://devAdmin:devAdmin@cluster0.b66h6hm.mongodb.net/training_guides';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Mongoose Schema and Model
const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  contactNo: String,
  country: String,
  state: String,
  companyName: String,
  role: String,
  message: String,
});

const FormData = mongoose.model('FormData', formDataSchema);

// POST route to handle form submissions
app.post('/submit', (req, res) => {
  const newFormData = new FormData(req.body);

  newFormData.save()
    .then(() => res.status(200).json('Form data saved successfully'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});
// GET route to search for form submissions by name
app.get('/formdata/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  FormData.find({ $or: [
    { firstName: { $regex: name, $options: 'i' } },
    { lastName: { $regex: name, $options: 'i' } }
  ]})
  .then(data => {
    if (data.length === 0) {
      // If no user is found, send a 404 response with a custom message
      return res.status(404).json({ error: 'User not found' });
    }
    // If users are found, send them in the response
    res.status(200).json(data);
  })
  .catch(err => res.status(400).json({ error: `Error: ${err}` }));
});


// PUT route to update existing form data
app.put('/submit/:id', (req, res) => {
  FormData.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedData => res.status(200).json('Form data updated successfully'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// DELETE route to delete a form submission by ID
app.delete('/formdata/:id', (req, res) => {
  FormData.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json('Form data deleted successfully'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});
// Existing code...

// GET route to fetch all form submissions
app.get('/formdata', (req, res) => {
  FormData.find()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// POST route to save the file name submitted via third-party file uploader
// app.post('/upload-file', (req, res) => {
//   const { fileName } = req.body;  // Assume the file name is sent in the request body

//   if (!fileName) {
//     return res.status(400).json({ error: 'File name is required' });
//   }

//   // Save the file name in the MongoDB database
//   const newFileData = new FormData({ fileName });

//   newFileData.save()
//     .then(() => res.status(200).json('File name saved successfully'))
//     .catch(err => res.status(400).json(`Error: ${err}`));
// });


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
