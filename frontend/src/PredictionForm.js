import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PredictionForm.css"; // Import the CSS for styling

const PredictionForm = () => {
  const [sensorData, setSensorData] = useState({
    co: 0,
    humidity: 0,
    temp: 0,
    noise: 0,
    prediction: "",
  });

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/predict-data"); // Backend API
      setSensorData(response.data); // Update the state with the response data
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  // Fetch data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="container">
      <h2>Environment Prediction System</h2>
      <div className="sensor-inputs">
        <div className="sensor">
          <label>CO Level</label>
          <div className="sensor-value">{sensorData.co}</div>
        </div>
        <div className="sensor">
          <label>Humidity</label>
          <div className="sensor-value">{sensorData.humidity}</div>
        </div>
        <div className="sensor">
          <label>Temperature</label>
          <div className="sensor-value">{sensorData.temp}</div>
        </div>
        <div className="sensor">
          <label>Noise Level</label>
          <div className="sensor-value">{sensorData.noise}</div>
        </div>
      </div>
      <div className="prediction-result">
        <h3>Real-Time Environment Prediction</h3>
        <div
          className={`prediction-box ${
            sensorData.prediction === "Ideal Environment (Good)"
              ? "good"
              : "bad"
          }`}
        >
          {sensorData.prediction || "Awaiting prediction..."}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
