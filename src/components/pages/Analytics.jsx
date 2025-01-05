
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Use useParams to get the city from the URL
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import './Analytics.css'

// Register necessary Chart.js components including ArcElement for Pie Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Register ArcElement for Pie chart
);

const Analytics = () => {
  const { city } = useParams(); // Get the city from the URL
  const [data, setData] = useState([]);
  
  // Create references for each chart
  const lineChartRef = useRef();
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const barChart2Ref = useRef();
  const lineChart2Ref = useRef();

  useEffect(() => {
    // Fetch the data for the city
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/historical-data/city?city=${city}`);
        const cityData = await response.json();
        const validData = cityData.filter((record) => record.date && record.aqi !== null);
        setData(validData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, [city]);

  if (!data || data.length === 0) {
    return (
      <div>
        <h2>No data available for analytics. Please go back.</h2>
      </div>
    );
  }

  // Define AQI categories
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 150) return 'Moderate';
    if (aqi <= 200) return 'Poor';
    return 'Very Poor';
  };

  // Count the days in each AQI category
  const categoryCounts = {
    Good: 0,
    Satisfactory: 0,
    Moderate: 0,
    Poor: 0,
    'Very Poor': 0,
  };

  data.forEach((record) => {
    const category = getAQICategory(record.aqi);
    categoryCounts[category]++;
  });

  const pieChartData = {
    labels: ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor'],
    datasets: [
      {
        label: 'AQI Status Distribution',
        data: [
          categoryCounts.Good,
          categoryCounts.Satisfactory,
          categoryCounts.Moderate,
          categoryCounts.Poor,
          categoryCounts['Very Poor'],
        ],
        backgroundColor: ['rgba(75,192,192,0.2)', 'rgba(255,159,64,0.2)', 'rgba(255,99,132,0.2)', 'rgba(255,205,86,0.2)', 'rgba(153,102,255,0.2)'],
        borderColor: ['rgba(75,192,192,1)', 'rgba(255,159,64,1)', 'rgba(255,99,132,1)', 'rgba(255,205,86,1)', 'rgba(153,102,255,1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartData = {
    labels: data.map((record) => record.date), // Dates as labels
    datasets: [
      {
        label: "AQI",
        data: data.map((record) => record.aqi),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: true,
      },
      {
        label: "Nitrogen Dioxide (ppm)",
        data: data.map((record) => record.no2),
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Carbon Monoxide (ppm)",
        data: data.map((record) => record.co),
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Ozone (ppm)",
        data: data.map((record) => record.o3), // Ozone data
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Sulfur Dioxide (ppm)",
        data: data.map((record) => record.so2), // SO2 data
        backgroundColor: "rgba(255,205,86,0.2)",
        borderColor: "rgba(255,205,86,1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Analytics for ${city}`,
      },
    },
  };



  return (
    <div>
      <h2 className="typing-effect">Analytics for {city}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ width: '48%', height: '400px', margin: '10px' }}>
          <h4>AQI Line Chart</h4>
          <Line ref={lineChartRef} data={chartData} options={options} />
        </div>
        <div style={{ width: '48%', height: '400px', margin: '10px' }}>
          <h4>AQI Bar Chart</h4>
          <Bar ref={barChartRef} data={chartData} options={options} />
        </div>
        <div style={{ width: '48%', height: '400px', margin: '10px' }}>
          <h4>AQI Verdict Pie Chart</h4>
          <Pie ref={pieChartRef} data={pieChartData} options={options} />
        </div>
        {/* <div style={{ width: '48%', height: '400px', margin: '10px' }}>
          <h4>Additional AQI Bar Chart</h4>
          <Bar ref={barChart2Ref} data={chartData} options={options} />
        </div> */}
        <div style={{ width: '48%', height: '400px', margin: '10px', textAlign: 'center' }}>
          <h4>Additional AQI Line Chart</h4>
          <Line ref={lineChart2Ref} data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
