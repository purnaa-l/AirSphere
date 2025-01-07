import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import './ResolveQueries.css'; // Import CSS for ViewCities
import { useNavigate } from "react-router-dom";

const REST_API_BASE_URL = "http://localhost:8080/api/aqi/contact-us"; // Replace with your actual API base URL

const ResolveQueries = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(`${REST_API_BASE_URL}`);
        setQueries(response.data);
        toast.info("Fetched all queries successfully.");
      } catch (error) {
        toast.error("Error fetching queries.");
      }
    };

    fetchQueries();
  }, []);

  const handleResolveQuery = (id, query, email) => {
    const subject = `Response for Query: ${query}`;
    const body = `Dear AirSphere User,\n\nThank you for your query. We have received the following query: \n"${query}".\nThis is our response: \nBest Regards,\nAdmin`;

    // Construct the Gmail URL with pre-filled subject and body
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the Gmail compose window in the browser
    window.location.href = gmailUrl;
  };

  const handleStatusChange = async (contactId, status) => {
    try {
      if (!contactId) {
        toast.error("Invalid contact ID.");
        return;
      }

      // Optimistically update the status in the UI
      const updatedQueries = queries.map((query) =>
        query.contactId === contactId
          ? { ...query, resolved: status }
          : query
      );
      setQueries(updatedQueries);

      const response = await axios.get(
        `${REST_API_BASE_URL}/${contactId}`,
        { resolved: status }
      );
      console.log(response);

      if (response.status === 200) {
        toast.success("Query status updated successfully.");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Error updating query status.");
    }
  };

  return (
    <div className="unique-contact-form-wrapper">
      <div className="clouds"></div>
      <h2 className="unique-contact-form-title">Existing Queries</h2>

      <div style={{ marginTop: '20px' }}>
        {queries.length > 0 ? (
          <table className="unique-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Query</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query.contactId}>
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td>{query.mobileNumber}</td>
                  <td>{query.query}</td>
                  <td>
                    <button
                      className="unique-submit-btn delete-btn"
                      onClick={() => handleResolveQuery(query.contactId, query.query, query.email)}
                    >
                      Resolve
                    </button>
                  </td>
                  <td>
                    <select
                      value={query.resolved ? "Resolved" : "Not Resolved"}
                      onChange={(e) => handleStatusChange(query.contactId, e.target.value === "Resolved")}
                    >
                      <option value="Not Resolved">Not Resolved</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No queries available.</p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResolveQueries;
