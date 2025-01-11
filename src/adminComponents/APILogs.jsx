import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table support in jsPDF
import APILogAnalytics from "./APILogAnalytics"; // Import Analytics Component
import './APILogs.css'; // Import CSS for APILogs

const REST_API_BASE_URL = "http://localhost:8080"; // Replace with your actual API base URL

const APILogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${REST_API_BASE_URL}/apilog/all`);
        setLogs(response.data);
        setFilteredLogs(response.data); // Initialize with all logs
        toast.info("Fetched all API logs successfully.");
      } catch (error) {
        toast.error("Error fetching API logs.");
      }
    };

    fetchLogs();
  }, []);

  // Handle filter change
  useEffect(() => {
    let filtered = logs;
    if (filter === "valid") {
      filtered = logs.filter(log => log.statusCode === 200);
    } else if (filter === "invalid") {
      filtered = logs.filter(log => log.statusCode > 200);
    }
    setFilteredLogs(filtered);
  }, [filter, logs]);

  // PDF download logic
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("API Logs", 14, 16);

    const tableData = filteredLogs.map(log => [
      log.logId,
      log.endpoint,
      log.statusCode,
      new Date(log.requestTimestamp).toLocaleString()
    ]);

    doc.autoTable({
      head: [['Log ID', 'Endpoint', 'Status', 'Timestamp']],
      body: tableData,
      startY: 20,
    });

    doc.save("api_logs.pdf");
  };

  return (
    <div className="apilog-container">
      <div className="apilog-header">
        <h2 className="apilog-title">API Logs</h2>
        <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="valid">Valid (200)</option>
          <option value="invalid">Invalid ({">"}200)</option>
        </select>
      </div>

      <div className="apilog-content">
        {filteredLogs.length > 0 ? (
          <table className="apilog-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.logId}>
                  <td>{log.logId}</td>
                  <td>{log.endpoint}</td>
                  <td>{log.statusCode}</td>
                  <td>{new Date(log.requestTimestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No API logs available.</p>
        )}
      </div>

      <div className="download-btn-wrapper">
        <button className="download-btn" onClick={handleDownloadPDF}>
          Download API Logs as PDF
        </button>
        <button className="download-btn" onClick={() => setShowAnalytics(!showAnalytics)}>
          {showAnalytics ? "Hide Analytics" : "View Analytics"}
        </button>
      </div>

      {/* Show Analytics Section */}
      {showAnalytics && <APILogAnalytics logs={filteredLogs} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default APILogs;
