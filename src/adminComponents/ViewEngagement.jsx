import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../components/layouts/Spinner";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import AgeDistinctionChart from "./charts/AgeGroupDistinctionChart";
import RetentionRateChart from "./charts/RetentionRateChart";
import UserGrowthChart from "./charts/UserGrowthChart";
import EngagementMetricsChart from "./charts/EngagementMetricsChart";
import DeviceUsageChart from "./charts/DeviceUsageChart";
import "./ViewEngagement.css";
import { useNavigate } from "react-router-dom";

const userEngagementData = [
  { name: "Jan", uv: 300, pv: 240 },
  { name: "Feb", uv: 400, pv: 320 },
  { name: "Mar", uv: 350, pv: 290 },
  { name: "Apr", uv: 450, pv: 360 },
  { name: "May", uv: 500, pv: 400 },
  { name: "Jun", uv: 550, pv: 450 },
];

function ViewEngagement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".main-dashboard");
    if (!element) {
      toast.error("Dashboard element not found!", { position: toast.POSITION.TOP_CENTER });
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

      const formattedDate = selectedDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-");
      
      const fileName = `dashboard_${formattedDate}.pdf`;
      pdf.save(fileName);

      toast.success("PDF downloaded successfully!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="icon-margin">
        <ul className="icon-list">
          <li className="icon-item" onClick={() => navigate("/admin")}>🏠</li>
          <li className="icon-item">⚙️</li>
          <li className="icon-item" onClick={()=>navigate("/add-data")}>➕</li>
          <li className="icon-item" onClick={handleDownloadPDF}>📄</li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-dashboard">
        <div className="greeting-section">
          <div className="typing-animation">
            <span className="greeting-text">Hello Admin</span>
          </div>
          <p className="greeting-subtext">Welcome to the AirSphere dashboard</p>
        </div>

        {/* Date Picker Section */}
        <div className="date-picker-container">
          <h1 className="dashboard-title">AirSphere Admin Dashboard</h1>
          <div className="date-picker-section">
            <label className="date-picker-label">Select Date: </label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="MMMM d, yyyy"
              className="date-picker-input"
              maxDate={new Date()}
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="sample">
          <div className="dashboard-card">
            <h3 className="card-title">User Retention Rate</h3>
            <p className="card-percentage positive">+12%</p>
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">New User Sign-ups</h3>
            <p className="card-percentage positive">+8%</p>
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Active Users</h3>
            <p className="card-percentage positive">+15%</p>
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Churn Rate</h3>
            <p className="card-percentage negative">-5%</p>
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Average Session Duration</h3>
            <p className="card-percentage positive">+10%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-row">
          <div className="chart-section">
            <h3 className="chart-title">User Retention Over Time</h3>
            <RetentionRateChart />
          </div>
          <div className="chart-section">
            <h3 className="chart-title">Device Usage Distribution</h3>
            <DeviceUsageChart />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-section">
            <h3 className="chart-title">Growth of Active Users</h3>
            <UserGrowthChart />
          </div>
          <div className="chart-section">
            <h3 className="chart-title">Engagement Metrics Overview</h3>
            <EngagementMetricsChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEngagement;
