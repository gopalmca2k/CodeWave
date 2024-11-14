import React, { useState } from 'react';
import axios from 'axios';
import ContactForm from '../form/Form';
import './searchbox.css'; // Import the CSS file

const SearchBox = () => {
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/formdata/search', {
        params: { name }
      });
      setResults(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateClick = (user) => {
    console.log('Selected User ID:', user._id);
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/formdata/${id}`);
      setResults(results.filter(result => result._id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="search-container">
      <h2>Search Users</h2>
      <div className="search-input">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      <ul className="search-results">
        {results.map((item, index) => (
          <li key={index}>
            <strong>{item.firstName} {item.lastName}</strong><br />
            <span>Email: {item.email}</span><br />
            <span>Contact No: {item.contactNo}</span><br />
            <span>Country: {item.country}</span><br />
            <span>State: {item.state}</span><br />
            <span>Company Name: {item.companyName}</span><br />
            <span>Role: {item.role}</span><br />
            <span>Message: {item.message}</span><br />
            {/* <button className="update-btn" onClick={() => handleUpdateClick(item)}>Update</button>
            <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button> */}
          </li>
        ))}
      </ul>

      {/* Render the form for updating */}
      {selectedUser && <ContactForm initialData={selectedUser} />}
    </div>
  );
};

export default SearchBox;
