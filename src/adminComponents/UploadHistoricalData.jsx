import React, { useState } from "react";
import "./UploadHistoricalData.css"; // Make sure to import the CSS file you created.
import { postHistoricalData } from "../services/AqiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const UploadHistoricalData = () => {
  const [formData, setFormData] = useState({
    city: "",
    no2: "",
    so2: "",
    ozone: "",
    co: "",
    aqi: "",
    verdict: "",
    date: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split('T'); // Split at 'T' to match the "YYYY-MM-DDTHH:mm:ss" format
    return `${formattedDate[0]}T${formattedDate[1].substring(0, 8)}`; // Return in desired format
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the date to match the required format
    const formattedDate = formatDate(formData.date);

    const dataToSend = { ...formData, date: formattedDate }; // Add the formatted date
    
    // Call postHistoricalData without awaiting it
    postHistoricalData(dataToSend)
      .then((response) => {
        // Success: Show success toast and reset the form
        toast.success("Data uploaded successfully!");
        setFormData({
          city: "",
          no2: "",
          so2: "",
          ozone: "",
          co: "",
          aqi: "",
          verdict: "",
          date: "",
        });
      })
      .catch((error) => {
        // Error: Show error toast
        toast.error("Failed to upload data.");
      });
  };

  return (
    <div className="unique-contact-form-wrapper">
      <div className="clouds"></div> {/* Add clouds background animation */}
      <h2 className="unique-contact-form-title">Upload Historical Data</h2>
      <form onSubmit={handleSubmit} className="unique-contact-form-content">
        <div className="unique-form-group-container">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="no2">NO2 (µg/m³):</label>
          <input
            type="number"
            id="no2"
            name="no2"
            value={formData.no2}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="so2">SO2 (µg/m³):</label>
          <input
            type="number"
            id="so2"
            name="so2"
            value={formData.so2}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="ozone">Ozone (µg/m³):</label>
          <input
            type="number"
            id="ozone"
            name="ozone"
            value={formData.ozone}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="co">CO (µg/m³):</label>
          <input
            type="number"
            id="co"
            name="co"
            value={formData.co}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="aqi">AQI:</label>
          <input
            type="number"
            id="aqi"
            name="aqi"
            value={formData.aqi}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="verdict">Verdict:</label>
          <input
            type="text"
            id="verdict"
            name="verdict"
            value={formData.verdict}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div className="unique-form-group-container">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="unique-input-field"
            required
          />
        </div>
        <div>
          <button type="submit" className="unique-submit-btn">Upload Data</button>
        </div>
      </form>
      <ToastContainer /> {/* Toast container for showing notifications */}
    </div>
  );
};

export default UploadHistoricalData;
