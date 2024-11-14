import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import navigate and location for navigation and state passing
import './form.css';

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formDataList, setFormDataList] = useState([]);
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation();

  const initialData = location.state?.user;

  const fetchFormData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/formdata');
      setFormDataList(response.data);
    } catch (error) {
      console.error('Error fetching form data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchFormData();

    if (initialData) {
      for (let key in initialData) {
        setValue(key, initialData[key]);
      }
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      if (initialData && initialData._id) {
        await axios.put(`http://localhost:5000/submit/${initialData._id}`, data);
      } else {
        await axios.post('http://localhost:5000/submit', data);
      }
      setSubmitted(true);
      reset();
      fetchFormData();
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <>
      
      <div className="contact-form-container">
        <h2 className='heading'>User Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input type="text" id="firstName" {...register('firstName', { required: true })} />
              {errors.firstName && <span className="error">This field is required</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" {...register('lastName')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" {...register('email', { required: true })} />
              {errors.email && <span className="error">This field is required</span>}
            </div>
            <div className="form-group">
              <label htmlFor="contactNo">Contact no.</label>
              <input type="tel" id="contactNo" {...register('contactNo', { required: true })} />
              {errors.contactNo && <span className="error">This field is required</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input type="text" id="country" {...register('country', { required: true })} />
              {errors.country && <span className="error">This field is required</span>}
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input type="text" id="state" {...register('state')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input type="text" id="companyName" {...register('companyName')} />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" {...register('role', { required: true })}>
                <option value="">Select a role</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                {/* Add more options here as needed */}
              </select>
              {errors.role && <span className="error">This field is required</span>}
            </div>
          </div>
          <div>
            <label htmlFor="message">Message *</label>
            <textarea id="message" {...register('message', { required: true })} /></div>

          {/* More form fields */}
          <button type="submit" className="btn submit-btn">Submit</button>
        </form>
        {submitted && <p className="success">Thank you for your message!</p>}
        {error && <p className="error">{error}</p>}

        {/* New navigation buttons */}
        <div className="navigation-buttons">
          <button onClick={() => navigate('/Search')} className="btn nav-btn">Go to Search</button>
          <button onClick={() => navigate('/Usertable')} className="btn nav-btn">Go to User Table</button>
          
        </div>
        
      </div>
    </>
  );
};

export default ContactForm;
