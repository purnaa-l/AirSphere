import axios from "axios";
const REST_API_BASE_URL="http://localhost:8080/api/aqi"
const REST_API_HISTORICAL_URL="http://localhost:8080/api/historical-data"
const REST_API_CONTACT_URL="http://localhost:8080/api/aqi/contact-us"
const REST_API_ADD_CITY_URL="http://localhost:8080/api/aqi/admin/add-cities"

export const listAQIs=()=>{
    return axios.get(REST_API_HISTORICAL_URL);
}

export const postAQIs=(aqi)=>axios.post(REST_API_BASE_URL, aqi);
export const postQuery=(query)=>axios.post(REST_API_CONTACT_URL, query);
export const postCity=(city)=>axios.post(REST_API_ADD_CITY_URL, city);
const REST_API_CHATBOT_URL = "http://localhost:8080/api/aqi/chatbot/query";

// Service function to send a query to the backend and receive a response
export const postChatQuery = async (userMessage) => {
    const maxLength = 1000; // Set an appropriate length limit
    const truncatedMessage = userMessage.length > maxLength ? userMessage.substring(0, maxLength) : userMessage;

    console.log("Sending message to backend:", { message: truncatedMessage }); // Log the message

    try {
        const response = await axios.post(REST_API_CHATBOT_URL, { message: truncatedMessage }, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Error in sending chatbot query:", error);
        return "Sorry, something went wrong! Please try again later.";
    }
};

export const getCities = async () => {
    try {
      const response = await axios.get(REST_API_GET_CITIES_URL);
      return response.data.map(city => ({
        id: city.id,
        name: city.name.toLowerCase(), // Convert city name to lowercase
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error; // Re-throw error for handling in the component
    }
  };

export const checkCityExists = async (cityName) => {
    try {
      const response = await axios.get(`${REST_API_ADD_CITY_URL}?cityName=${encodeURIComponent(cityName)}`);
      return response.data.exists; // Adjust based on your API's response format
    } catch (error) {
      console.error("Error checking if city exists:", error);
      throw error;
    }
  };

const API_URL = 'http://localhost:8080/api/sql/aqi';

export const getAvgAqiByCity = async () => {
    try {
        const response = await axios.get(`${API_URL}/avg-aqi`);
        return response.data;
    } catch (error) {
        console.error('Error fetching average AQI data', error);
    }
};

export const getRecordCountByCity = async () => {
    try {
        const response = await axios.get(`${API_URL}/record-count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching record count data', error);
    }
};

export const getMaxAqiByCity = async () => {
    try {
        const response = await axios.get(`${API_URL}/max-aqi`);
        return response.data;
    } catch (error) {
        console.error('Error fetching max AQI data', error);
    }
};

export const getMinAqiByCity = async () => {
    try {
        const response = await axios.get(`${API_URL}/min-aqi`);
        return response.data;
    } catch (error) {
        console.error('Error fetching min AQI data', error);
    }
};
