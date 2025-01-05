import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import './ViewCities.css'; // Import CSS for ViewCities

const REST_API_BASE_URL = "http://localhost:8080/api"; // Replace with your actual API base URL

const ViewCities = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${REST_API_BASE_URL}/aqi/admin/add-cities`);
        setCities(response.data);
        toast.info("Fetched all cities successfully.");
      } catch (error) {
        toast.error("Error fetching cities.");
      }
    };

    fetchCities();
  }, []);

  const handleDeleteCity = async (id) => {
    // Create a confirmation toast
    const deleteToast = toast.loading("Are you sure you want to delete this city?", {
      autoClose: false,  // Don't auto-close
      closeButton: true,
      onClose: () => {}  // Keep open until user action
    });

    // Update the toast to ask for confirmation
    toast.update(deleteToast, {
      render: "Are you sure you want to delete this city?",
      type: "info",  // Corrected to string
      isLoading: false,
      closeButton: true,
      onClick: () => {
        // Handle deletion confirmation
        handleConfirmDelete(id);
        toast.dismiss(deleteToast);  // Dismiss the confirmation toast
      },
      progress: undefined,
    });

    // Add a reject option
    toast.success("Click on the toast to confirm deletion or close to cancel.");
  };

  const handleConfirmDelete = async (id) => {
    try {
      await axios.delete(`${REST_API_BASE_URL}/aqi/admin/add-cities/${id}`);
      toast.success("City deleted successfully!");
      setCities(cities.filter(city => city.city_id !== id)); // Update the state
    } catch (error) {
      toast.error("Error deleting city.");
    }
  };

  return (
    <div className="unique-contact-form-wrapper">
      <div className="clouds"></div>
      <h2 className="unique-contact-form-title">Existing Cities</h2>

      <div style={{ marginTop: '20px' }}>
        {cities.length > 0 ? (
          <table className="unique-table">
            <thead>
              <tr>
                <th>City ID</th>
                <th>City</th>
                <th>Description</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.city_id}>
                  <td>{city.city_id}</td>
                  <td>{city.city}</td>
                  <td>{city.description}</td>
                  <td>{city.author}</td>
                  <td>
                    <button
                      className="unique-submit-btn delete-btn"
                      onClick={() => handleDeleteCity(city.city_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No cities available.</p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ViewCities;
