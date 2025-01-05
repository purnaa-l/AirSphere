import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import './AddCities.css'; // Import CSS for AddCities
import { postCity, checkCityExists } from "../services/AqiService";
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import ViewCities from "./ViewCities";

const AddCities = () => {
  const [formData, setFormData] = useState({
    city: "",
    description: "",
    author: ""
  });

  const [errors, setErrors] = useState({
    city: "",
    description: "",
    author: ""
  });

  const navigate = useNavigate();  // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.city) {
      newErrors.city = "City Name is required.";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "A valid description is required.";
      isValid = false;
    }

    if (!formData.author) {
      newErrors.author = "Author name is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString(); 
    const formattedTimestamp = formattedDate.split('T').join(' ').split('Z')[0]; 

    const updatedFormData = { 
      ...formData, 
      created_at: formattedTimestamp 
    };

    if (validateForm()) {
      try {
        const cityExists = await checkCityExists(formData.city);
        if (cityExists) {
          toast.error("City already exists.");
          return;
        }

        const formResponse = await postCity(updatedFormData);
        toast.success("Form submitted successfully!"); 
        setFormData({ city: "", description: "", author: "" });
      } catch (error) {
        toast.error("Something went wrong. Try again.");
        setFormData({ city: "", description: "", author: "" });
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <div className="unique-contact-form-wrapper">
      <div className="clouds"></div>
      <h2 className="unique-contact-form-title">Add City</h2>
      <form className="unique-contact-form-content" onSubmit={handleSubmit}>
        <div className="unique-form-group-container">
          <label htmlFor="city">City Name</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`unique-input-field ${errors.city ? "unique-error" : ""}`}
          />
          {errors.city && <p className="unique-error-text">{errors.city}</p>}
        </div>

        <div className="unique-form-group-container">
          <label htmlFor="description">City Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`unique-input-field ${errors.description ? "unique-error" : ""}`}
          />
          {errors.description && <p className="unique-error-text">{errors.description}</p>}
        </div>

        <div className="unique-form-group-container">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={`unique-input-field ${errors.author ? "unique-error" : ""}`}
          />
          {errors.author && <p className="unique-error-text">{errors.author}</p>}
        </div>

        <div className="unique-buttons-container">
          <button type="submit" className="unique-submit-btn">
            Add City
          </button>
          <button 
            type="button"
            onClick={() => navigate('/view-existing-cities')} // Navigate to the new route
            className="unique-submit-btn"
            style={{ marginLeft: '10px' }}
          >
            View Existing Cities
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCities;
