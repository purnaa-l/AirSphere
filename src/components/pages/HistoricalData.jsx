// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./HistoricalData.css";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
// import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
// import AnalyticsPage from "./Analytics";



// const HistoricalData = () => {
//   const pdfRef = useRef();
//   const [city, setCity] = useState("");
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(10);
//   const [sortOption, setSortOption] = useState("ascDate");
//   const [showAnalytics, setShowAnalytics] = useState(false);


//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const cityName = params.get("city");
//     setCity(cityName);

//     if (cityName) {
//       fetchHistoricalData(cityName);
//     }
//   }, []);

//   const fetchHistoricalData = async (cityName) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/historical-data/city?city=${cityName}`
//       );
//       const cityData = response.data;

//       // Filter out blank entries
//       const validData = cityData.filter(
//         (record) => record.date && record.aqi !== null
//       );

//       setData(validData);
//       setFilteredData(validData);

//       // Toast success message
//       toast.success("Historical data fetched successfully!");

//     } catch (error) {
//       console.error("Error fetching historical data:", error);
      
//       // Toast error message
//       toast.error("Failed to fetch historical data!");
//     }
//   };

//   const handleSort = (option) => {
//     let sortedData;
//     if (option === "ascDate") {
//       sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
//     } else if (option === "descDate") {
//       sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
//     } else if (option === "mostPolluted") {
//       sortedData = [...data].sort((a, b) => b.aqi - a.aqi);
//     } else if (option === "leastPolluted") {
//       sortedData = [...data].sort((a, b) => a.aqi - b.aqi);
//     }
//     setFilteredData(sortedData);
//     setSortOption(option);
//     setCurrentPage(1); // Reset pagination
//   };


//   const handleViewAnalytics = () => {
//     // Navigate to the analytics page
//     navigate(`/analytics/${city}`);
//   };

  
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const totalPages = Math.ceil(filteredData.length / recordsPerPage);

//     const generatePDFPage = (page) => {
//       const start = (page - 1) * recordsPerPage;
//       const end = start + recordsPerPage;
//       const pageData = filteredData.slice(start, end);

//       // Create a temporary div that will be used by html2canvas
//       const pageElement = document.createElement('div');
//       pageElement.classList.add('pdf-page');
//       pageElement.innerHTML = `
//         <h1>Historical Data for ${city}</h1>
//         <table class="data-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>City</th>
//               <th>Nitrogen Dioxide (ppm)</th>
//               <th>Sulphur Dioxide (ppm)</th>
//               <th>Ozone (ppm)</th>
//               <th>Carbon Monoxide (ppm)</th>
//               <th>AQI</th>
//               <th>Verdict</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${pageData.map(
//               (record) => `
//                 <tr>
//                   <td>${record.date}</td>
//                   <td>${record.city}</td>
//                   <td>${record.no2}</td>
//                   <td>${record.so2}</td>
//                   <td>${record.ozone}</td>
//                   <td>${record.co}</td>
//                   <td>${record.aqi}</td>
//                   <td>${record.verdict}</td>
//                 </tr>`
//             ).join('')}
//           </tbody>
//         </table>
//       `;

//       document.body.appendChild(pageElement); // Attach it to the DOM temporarily

//       setTimeout(() => {
//         html2canvas(pageElement).then((canvas) => {
//           const imgData = canvas.toDataURL("image/png");
//           doc.addImage(imgData, "PNG", 10, 10, 180, 160);

//           // If it's not the last page, add a new page in the PDF
//           if (page < totalPages) {
//             doc.addPage();
//             generatePDFPage(page + 1);
//           } else {
//             // Create a dynamic file name based on the city and page number
//             const fileName = `historical_data_${city}.pdf`;
//             doc.save(fileName);

//             // Success Toast
//             toast.success(`PDF downloaded successfully for ${city} !`);
//           }
          
//           // Remove the temporary page element from the DOM after rendering
//           document.body.removeChild(pageElement);
//         }).catch((err) => {
//           console.error("Error in rendering the page:", err);
//           document.body.removeChild(pageElement); // Cleanup in case of error
          
//           // Error Toast
//           toast.error("Error generating PDF, please try again.");
//         });
//       }, 500); // Delay to ensure DOM is updated
//     };

//     // Generate the current page PDF
//     generatePDFPage(currentPage); 
//   };

//   return (
//     <div className="historical-data-page" ref={pdfRef}>
//       {/* Header with Typing Effect */}
//       <h1 className="typing-effect">Historical Data for {city}</h1>

//       {/* Sorting Options */}
//       <div className="filter-options">
//         <label>Sort By:</label>
//         <select
//           className="fancy-dropdown"
//           value={sortOption}
//           onChange={(e) => handleSort(e.target.value)}
//         >
//           <option value="ascDate">Ascending Date</option>
//           <option value="descDate">Descending Date</option>
//           <option value="mostPolluted">Most Polluted</option>
//           <option value="leastPolluted">Least Polluted</option>
//         </select>
//       </div>

//       {/* Data Table */}
//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>City</th>
//             <th>Nitrogen Dioxide (ppm)</th>
//             <th>Sulphur Dioxide (ppm)</th>
//             <th>Ozone (ppm)</th>
//             <th>Carbon Monoxide (ppm)</th>
//             <th>AQI</th>
//             <th>Verdict</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((record, index) => (
//             <tr key={index}>
//               <td>{record.date}</td>
//               <td>{record.city}</td>
//               <td>{record.no2}</td>
//               <td>{record.so2}</td>
//               <td>{record.ozone}</td>
//               <td>{record.co}</td>
//               <td>{record.aqi}</td>
//               <td>{record.verdict}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="pagination">
//         {Array.from(
//           { length: Math.ceil(filteredData.length / recordsPerPage) },
//           (_, i) => (
//             <button
//               key={i}
//               onClick={() => handlePageChange(i + 1)}
//               className={currentPage === i + 1 ? "active" : ""}
//             >
//               {i + 1}
//             </button>
//           )
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="action-buttons">
//         <button className="fancy-button" onClick={downloadPDF}>
//           Download PDF
//         </button>
//         <button className="fancy-button" onClick={handleViewAnalytics}>
//         View Analytics
//       </button>


//       </div>

//       {/* Toast Container */}
//       <ToastContainer />
//       {/* Conditional Rendering for Analytics */}
// {showAnalytics && (
//   <div className="analytics-section">
//     {/* Call your analytics component or insert dynamic graph logic here */}
//     <AnalyticsPage data={filteredData} city={city} />
//   </div>
// )}

//     </div>
//   );
// };

// export default HistoricalData;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./HistoricalData.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const HistoricalData = () => {
  const pdfRef = useRef();
  const navigate = useNavigate(); // Initialize navigate
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
      const response = await axios.get(
        `http://localhost:8080/api/historical-data/city?city=${cityName}`
      );
      const cityData = response.data;

      // Filter out blank entries
      const validData = cityData.filter(
        (record) => record.date && record.aqi !== null
      );

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

  const handleViewAnalytics = () => {
    // Navigate to the analytics page
    navigate(`/analytics/${city}`);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const generatePDFPage = (page) => {
      const start = (page - 1) * recordsPerPage;
      const end = start + recordsPerPage;
      const pageData = filteredData.slice(start, end);

      // Create a temporary div that will be used by html2canvas
      const pageElement = document.createElement('div');
      pageElement.classList.add('pdf-page');
      pageElement.innerHTML = `
        <h1>Historical Data for ${city}</h1>
        <table class="data-table">
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
            ${pageData.map(
              (record) => `
                <tr>
                  <td>${record.date}</td>
                  <td>${record.city}</td>
                  <td>${record.no2}</td>
                  <td>${record.so2}</td>
                  <td>${record.ozone}</td>
                  <td>${record.co}</td>
                  <td>${record.aqi}</td>
                  <td>${record.verdict}</td>
                </tr>`
            ).join('')}
          </tbody>
        </table>
      `;

      document.body.appendChild(pageElement); // Attach it to the DOM temporarily

      setTimeout(() => {
        html2canvas(pageElement).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          doc.addImage(imgData, "PNG", 10, 10, 180, 160);

          // If it's not the last page, add a new page in the PDF
          if (page < totalPages) {
            doc.addPage();
            generatePDFPage(page + 1);
          } else {
            // Create a dynamic file name based on the city and page number
            const fileName = `historical_data_${city}.pdf`;
            doc.save(fileName);

            // Success Toast
            toast.success(`PDF downloaded successfully for ${city} !`);
          }
          
          // Remove the temporary page element from the DOM after rendering
          document.body.removeChild(pageElement);
        }).catch((err) => {
          console.error("Error in rendering the page:", err);
          document.body.removeChild(pageElement); // Cleanup in case of error
          
          // Error Toast
          toast.error("Error generating PDF, please try again.");
        });
      }, 500); // Delay to ensure DOM is updated
    };

    // Generate the current page PDF
    generatePDFPage(currentPage); 
  };

  return (
    <div className="historical-data-page" ref={pdfRef}>
      {/* Header with Typing Effect */}
      <h1 className="typing-effect">Historical Data for {city}</h1>

      {/* Sorting Options */}
      <div className="filter-options">
        <label>Sort By:</label>
        <select
          className="fancy-dropdown"
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
        >
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
        {Array.from(
          { length: Math.ceil(filteredData.length / recordsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="fancy-button" onClick={downloadPDF}>
          Download PDF
        </button>
        <button className="fancy-button" onClick={handleViewAnalytics}>
          View Analytics
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default HistoricalData;
