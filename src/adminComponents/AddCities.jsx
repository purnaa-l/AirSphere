import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import './AddCities.css';
import { postCity } from "../services/AqiService";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const AddCities = () => {
  const [formData, setFormData] = useState({
    city: "",
    description: "",
    author: "" // Changed to 'author' to match input name
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

  const handleSubmit = async (e) =>  {
    e.preventDefault();
  
    // Create the created_at value dynamically with current timestamp in the format 'YYYY-MM-DD HH:mm:ss.ssssss'
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString(); // This will give us a format like '2025-01-04T00:27:14.078Z'
    const formattedTimestamp = formattedDate.split('T').join(' ').split('Z')[0]; // Convert to '2025-01-04 00:27:14.078'
  
    // Log for debugging
    console.log("Formatted Timestamp: ", formattedTimestamp);
  
    // Add the formatted timestamp to formData
    const updatedFormData = { 
      ...formData, 
      created_at: formattedTimestamp // Timestamp in the correct format
    };
  
    console.log("Form Data being submitted: ", updatedFormData); // Log the updated form data
  
    if (validateForm()) {
      try {
        const formResponse = await postCity(updatedFormData);
        console.log("Form submission response: ", formResponse);
        toast.success("Form submitted successfully!"); // Success toast
        setFormData({ city: "", description: "", created_by: "" });
  
        // Navigate to a new route after submission (optional)
        navigate('/some-path'); // Adjust the path based on your routing structure
      } catch (error) {
        console.log("Error submitting data", error);
        toast.error("Something went wrong. Try again.");
        setFormData({ city: "", description: "", created_by: "" });
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };
  
  
  

  const handleViewCities = () => {
    navigate('/view-cities');  // Navigate to the route where cities are listed
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
            Submit
          </button>
          
          <button 
            onClick={handleViewCities} 
            className="unique-submit-btn"
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
