import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import './APILogAnalytics.css';

// Registering required Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement);

const APILogAnalytics = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch API logs from the backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8080/apilog/all");
        const result = await response.json();
        setLogs(result);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter logs based on the selected filter
  const filteredLogs = logs.filter(log => {
    if (filter === "valid") {
      return log.statusCode === 200;
    } else if (filter === "invalid") {
      return log.statusCode > 200;
    }
    return true; // "all" option
  });

  // Processing the data for charts
  const responseTimeData = filteredLogs.map(log => new Date(log.requestTimestamp).toLocaleString());
  const statusCodeData = filteredLogs.map(log => log.statusCode);
  const responseTimes = filteredLogs.map(log => log.responseTime);

  // Prepare the data for the Line Chart (Response Time over Time)
  const lineChartData = {
    labels: responseTimeData,
    datasets: [
      {
        label: "Response Time (ms)",
        data: responseTimes,
        borderColor: "#42A5F5",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Prepare the data for the Bar Chart (Count of Status Codes)
  const statusCodeCounts = statusCodeData.reduce((acc, code) => {
    acc[code] = acc[code] ? acc[code] + 1 : 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(statusCodeCounts),
    datasets: [
      {
        label: "Status Code Count",
        data: Object.values(statusCodeCounts),
        backgroundColor: "#66BB6A",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  // Prepare the data for the Pie Chart (Distribution of Status Codes)
  const pieChartData = {
    labels: Object.keys(statusCodeCounts),
    datasets: [
      {
        data: Object.values(statusCodeCounts),
        backgroundColor: ["#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#42A5F5"],
        hoverOffset: 4,
      },
    ],
  };

  // Loading State
  if (logs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="analytics-container">
      <h2>API Logs Analytics</h2>

      {/* Dropdown for filtering logs */}
      <div className="filter-container">
        <label htmlFor="filter">Filter Logs:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="valid">Valid Codes (200)</option>
          <option value="invalid">Invalid Codes ({">"} 200)</option>
        </select>
      </div>

      <div className="charts-row">
        {/* Line Chart for Response Time */}
        <div className="chart">
          <h3>Response Time Over Time</h3>
          <Line data={lineChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Response Time Trend' } } }} />
        </div>

        {/* Bar Chart for Status Code Count */}
        <div className="chart">
          <h3>Status Codes Count</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Status Code Distribution' } } }} />
        </div>

        {/* Pie Chart for Status Code Distribution */}
        <div className="chart">
          <h3>Status Code Distribution</h3>
          <Pie data={pieChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Status Code Proportions' } } }} />
        </div>
      </div>
    </div>
  );
};

export default APILogAnalytics;
