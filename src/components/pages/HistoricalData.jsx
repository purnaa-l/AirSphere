import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistoricalData.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistoricalData = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState("ascDate");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityName = params.get("city");
    setCity(cityName);

    if (cityName) {
      fetchHistoricalData(cityName);
    }
  }, []);

  const fetchHistoricalData = async (cityName) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/historical-data/city?city=${cityName}`);
      const cityData = response.data;

      // Filter out blank entries and only keep non-empty records
      const validData = cityData.filter(record => record.date && record.aqi !== null);
      setData(validData);
      setFilteredData(validData);

      // Toast success message
      toast.success("Historical data fetched successfully!");

    } catch (error) {
      console.error("Error fetching historical data:", error);
      
      // Toast error message
      toast.error("Failed to fetch historical data!");
    }
  };

  // Handle Sorting
  const handleSort = (option) => {
    let sortedData;
    if (option === "ascDate") {
      sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (option === "descDate") {
      sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "mostPolluted") {
      sortedData = [...data].sort((a, b) => b.aqi - a.aqi);
    } else if (option === "leastPolluted") {
      sortedData = [...data].sort((a, b) => a.aqi - b.aqi);
    }
    setFilteredData(sortedData);
    setSortOption(option);
    setCurrentPage(1); // Reset pagination
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate and download PDF (mock function, you can implement with a library like jsPDF)
  const downloadPDF = () => {
    console.log("Generate and download PDF here!");
  };

  const viewAnalytics = () => {
    console.log("Redirect to analytics!");
  };

  return (
    <div className="historical-data-page">
      {/* Header with Typing Effect */}
      <h1 className="typing-effect">Historical Data for {city}</h1>

      {/* Sorting Options */}
      <div className="filter-options">
        <label>Sort By:</label>
        <select className="fancy-dropdown" value={sortOption} onChange={(e) => handleSort(e.target.value)}>
          <option value="ascDate">Ascending Date</option>
          <option value="descDate">Descending Date</option>
          <option value="mostPolluted">Most Polluted</option>
          <option value="leastPolluted">Least Polluted</option>
        </select>
      </div>

      {/* Data Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>City</th>
            <th>Nitrogen Dioxide (ppm)</th>
            <th>Sulphur Dioxide (ppm)</th>
            <th>Ozone (ppm)</th>
            <th>Carbon Monoxide (ppm)</th>
            <th>AQI</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.city}</td>
              <td>{record.no2}</td>
              <td>{record.so2}</td>
              <td>{record.ozone}</td>
              <td>{record.co}</td>
              <td>{record.aqi}</td>
              <td>{record.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredData.length / recordsPerPage) }, (_, i) => (
          <button 
            key={i} 
            onClick={() => handlePageChange(i + 1)} 
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="fancy-button" onClick={viewAnalytics}>View Analytics</button>
        <button className="fancy-button" onClick={downloadPDF}>Download PDF</button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default HistoricalData;
