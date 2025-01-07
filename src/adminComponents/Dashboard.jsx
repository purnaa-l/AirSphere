import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../components/layouts/Spinner";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie } from "recharts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Dashboard.css'

// Function to compute standard deviation
const computeStandardDeviation = (values) => {
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

// Function to compute median
const computeMedian = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [aqiData, setAqiData] = useState({
    avgAqi: 0,
    maxAqi: 0,
    minAqi: 0,
    medianAqi: 0,
    stdevAqi: 0,
    totalAqi: 0,
    recordCount: 0,
  });
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
    fetchAqiData();
  }, []);

  const fetchAqiData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/sql/aqi/avg-aqi");
      console.log("API Response:", response);
      const { data } = response;

      if (data && data.length > 0) {
        // Extract AQI values
        const aqiValues = data.map((item) => item[1]);

        // Calculate Aggregates
        const avgAqi = aqiValues.reduce((acc, value) => acc + value, 0) / aqiValues.length;
        const maxAqi = Math.max(...aqiValues);
        const minAqi = Math.min(...aqiValues.filter(aqi=>aqi>0));
        const medianAqi = computeMedian(aqiValues);
        const stdevAqi = computeStandardDeviation(aqiValues);
        const totalAqi = aqiValues.reduce((acc, value) => acc + value, 0);
        console.log(minAqi)
        // Set computed data;
        setAqiData({
          avgAqi: avgAqi.toFixed(2),
          maxAqi: maxAqi,
          minAqi: minAqi,
          medianAqi: medianAqi,
          stdevAqi: stdevAqi.toFixed(2),
          totalAqi: totalAqi,
          recordCount: data.length,
        });

        // Prepare city data for charts
        const cityData = data.map(item => ({
          name: item[0],  // City name
          value: item[1], // AQI value
        }));

        setCities(cityData);
        toast.success("Successfully fetched!")

      } else {
        toast.error("No data found", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch AQI data", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="admin-dashboard-layout">
      <div className="admin-icon-margin">
        <ul className="admin-icon-list">
          <li className="admin-icon-item" onClick={() => navigate("/admin")}>🏠</li>
          <li className="admin-icon-item">⚙️</li>
          <li className="admin-icon-item" onClick={() => navigate("/add-data")}>➕</li>
        </ul>
      </div>

      <div className="admin-main-dashboard">
        <div className="admin-greeting-section">
          <div className="admin-typing-animation">
            <span className="admin-greeting-text">Hello Admin</span>
          </div>
          <p className="admin-greeting-subtext">Welcome to the AirSphere dashboard</p>
        </div>

        <div className="admin-date-picker-container">
          <h1 className="admin-dashboard-title">AQI in India Today: </h1>
          <div className="admin-date-picker-section">
            <label className="admin-date-picker-label">Select Date: </label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="MMMM d, yyyy"
              className="admin-date-picker-input"
              maxDate={new Date()}
            />
          </div>
        </div>

        <div className="admin-sample">
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Avg AQI</h3>
            <p className="admin-card-percentage positive">{aqiData.avgAqi}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Max AQI</h3>
            <p className="admin-card-percentage positive">{aqiData.maxAqi}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Min AQI</h3>
            <p className="admin-card-percentage negative">{aqiData.minAqi}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Median AQI</h3>
            <p className="admin-card-percentage">{aqiData.medianAqi}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Standard Deviation</h3>
            <p className="admin-card-percentage">{aqiData.stdevAqi}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Total AQI</h3>
            <p className="admin-card-percentage positive">{aqiData.totalAqi}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3 className="admin-card-title">Record Count</h3>
            <p className="admin-card-percentage positive">{aqiData.recordCount}</p>
          </div>
        </div>

        <div className="admin-view-analytics-container">
          <button
            className="admin-view-analytics-button"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? "Hide Analytics" : "View Analytics"}
          </button>
        </div>

        {showAnalytics && (
          <div className="admin-charts-row">
            <div className="admin-chart-section">
              <h3 className="admin-chart-title">City AQI Pie Chart</h3>
              <PieChart width={400} height={400}>
                <Pie
                  data={cities}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                />
              </PieChart>
            </div>

            <div className="admin-chart-section">
              <h3 className="admin-chart-title">City AQI Bar Graph</h3>
              <BarChart width={600} height={300} data={cities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>

            <div className="admin-chart-section">
              <h3 className="admin-chart-title">City AQI Line Chart</h3>
              <LineChart width={600} height={300} data={cities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
