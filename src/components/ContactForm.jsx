import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import './ContactForm.css';
import { postQuery } from "../services/AqiService";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    query: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    query: "",
  });

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

    if (!formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required.";
      isValid = false;
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
      isValid = false;
    }

    if (!formData.query) {
      newErrors.query = "Query is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    if (validateForm()) {
      try{
      const formResponse=await postQuery(formData);
      console.log(formResponse);
      toast.success("Form submitted successfully!"); // Success toast
      setFormData({ name: "", email: "", mobileNumber: "", query: "" });
    } 
    catch{
      console.log("Error submitting data");
      toast.error("Something went wrong. Try again.")
      setFormData({ name: "", email: "", mobileNumber: "", query: "" });

    }
  }
    else {

      toast.error("Please correct the errors in the form."); // Error toast
    }
  }





  return (
    <div className="unique-contact-form-wrapper">
      <div className="clouds"></div>
      <h2 className="unique-contact-form-title">Contact Us</h2>
      <form className="unique-contact-form-content" onSubmit={handleSubmit}>
        <div className="unique-form-group-container">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`unique-input-field ${errors.name ? "unique-error" : ""}`}
          />
          {errors.name && <p className="unique-error-text">{errors.name}</p>}
        </div>

        <div className="unique-form-group-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`unique-input-field ${errors.email ? "unique-error" : ""}`}
          />
          {errors.email && <p className="unique-error-text">{errors.email}</p>}
        </div>

        <div className="unique-form-group-container">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={`unique-input-field ${errors.mobileNumber ? "unique-error" : ""}`}
          />
          {errors.mobileNumber && <p className="unique-error-text">{errors.mobileNumber}</p>}
        </div>

        <div className="unique-form-group-container">
          <label htmlFor="query">Query</label>
          <textarea
            id="query"
            name="query"
            value={formData.query}
            onChange={handleChange}
            className={`unique-input-field ${errors.query ? "unique-error" : ""}`}
          />
          {errors.query && <p className="unique-error-text">{errors.query}</p>}
        </div>

        <button type="submit" className="unique-submit-btn">
          Submit
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>

  );
};

export default ContactForm;
