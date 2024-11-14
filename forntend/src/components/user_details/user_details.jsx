import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FormDataTable = () => {
  const [formDataList, setFormDataList] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch data from the server
  const fetchFormData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/formdata');
      setFormDataList(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const handleUpdateClick = (user) => {
    navigate('/', { state: { user } }); // Navigate to form page with user data
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/formdata/${id}`);
      setFormDataList(formDataList.filter((data) => data._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-data-table-container">
      <h2>Submitted Data</h2>
      {error && <p className="error">{error}</p>}
      {formDataList.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Country</th>
              <th>State</th>
              <th>Company Name</th>
              <th>Role</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formDataList.map((data, index) => (
              <tr key={index}>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.email}</td>
                <td>{data.contactNo}</td>
                <td>{data.country}</td>
                <td>{data.state}</td>
                <td>{data.companyName}</td>
                <td>{data.role}</td>
                <td>{data.message}</td>
                <td>
                  <button onClick={() => handleUpdateClick(data)}>Update</button>
                  <button onClick={() => handleDelete(data._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data submitted yet.</p>
      )}
    </div>
  );
};

export default FormDataTable;
