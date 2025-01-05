import React from 'react';
import './AddData.css'; // Import the CSS for styling
import { useNavigate } from 'react-router-dom';
function handleHistoricalData(){
    console.log('Pressed!')
}

const AddData = () => {
const navigate = useNavigate();  // Initialize the navigate function

  return (
    <div className="add-data-container">
      <div className="clouds"></div>

      <h1 className="typing-text">Hello Admin! What do you want to do today?</h1>

      <div className="button-group">
        <button className="action-btn" onClick={() => navigate('/add-cities')}>Add City</button>
        <button className="action-btn" onClick={() => navigate('/view-existing-cities')}>View Existing Cities</button>
        <button className="action-btn" onClick={handleHistoricalData}>Add Historical AQI</button>
      </div>
    </div>
  );
};

export default AddData;
