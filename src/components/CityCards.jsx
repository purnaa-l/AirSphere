import React, { useState, useEffect } from "react";
import "./CityCards.css";
import { useNavigate } from "react-router-dom";

const cityData = [
  { name: "Mysuru", description: "Known for its rich heritage and the majestic Mysore Palace." },
  { name: "Bengaluru", description: "The Silicon Valley of India, bustling with tech innovation." },
  { name: "Udupi", description: "Famous for its temples and delicious South Indian cuisine." },
  { name: "Mangalore", description: "A coastal city with pristine beaches and cultural landmarks." },
  { name: "Madikeri", description: "Nestled in the hills of Coorg, known for its coffee plantations." },
  { name: "Chennai", description: "A cultural hub with historic temples and beautiful beaches." },
  { name: "Madurai", description: "The temple city, home to the magnificent Meenakshi Temple." },
  { name: "Salem", description: "Known for its mangoes and vibrant textile industry." },
  { name: "Trichy", description: "Famous for its Rockfort Temple and scenic riverfront." },
  { name: "Coimbatore", description: "A major hub for textiles and manufacturing in Tamil Nadu." },
  { name: "Kochi", description: "A port city with a rich blend of history and modernity." },
  { name: "Kannur", description: "Known for its Theyyam performances and serene beaches." },
  { name: "Thrissur", description: "The cultural capital of Kerala, famous for Thrissur Pooram." },
  { name: "Thiruvananthapuram", description: "Kerala's capital, known for its serene beaches and backwaters." },
  { name: "Kozhikode", description: "Famous for its historic trade connections and Malabar cuisine." },
  { name: "Mumbai", description: "The City of Dreams, known for Bollywood and bustling life." },
  { name: "Pune", description: "A cultural and educational hub with a vibrant IT sector." },
  { name: "Nagpur", description: "The Orange City, famous for its citrus fruit and central location." },
  { name: "Nashik", description: "Known for its vineyards and religious significance in Hinduism." },
  { name: "Aurangabad", description: "Home to the Ajanta and Ellora caves, a UNESCO World Heritage Site." },
  { name: "Delhi", description: "India's capital, known for its history and vibrant markets." },
  { name: "Noida", description: "A modern hub for IT and urban development." },
  { name: "Vadodara", description: "Known for its rich cultural heritage, palaces, and the famous Lakshmi Vilas Palace."},
  { name: "Rajkot", description: "A prominent city in Gujarat, known for its textile industry and the birthplace of Mahatma Gandhi's childhood."},
  { name: "Bhavnagar", description: "Known for its historical sites, beaches, and the famous Takhteshwar Temple."},
  { name: "Surat", description: "Famous for its diamond cutting and polishing industry, as well as textile manufacturing."},
  { name: "Ahmedabad", description: "A historic city known for its textiles, Gandhi Ashram, and the Sabarmati riverfront."}
];

const CityCards = () => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const texts = ["Available Cities"];

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[textIndex];
      if (!isDeleting) {
        setTypingText((prev) => currentText.substring(0, prev.length + 1));
        if (typingText === currentText) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setTypingText((prev) => currentText.substring(0, prev.length - 1));
        if (typingText === "") {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typingText, isDeleting, textIndex, typingSpeed]);

  const handleCardClick = (city) => {
    navigate(`/historical-data?city=${city.name}`);
  };

  return (
    <div className="city-cards-page">
      {/* Typing Effect */}
      <h1 className="typing-effect">{typingText}</h1>

      {/* Carousel */}
      <div className="carousel">
        {cityData.map((city, index) => (
          <div
            key={index}
            className="city-card"
            onClick={() => handleCardClick(city)}
          >
            <h3>{city.name}</h3>
            <p>{city.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer-text">
        Not finding your city? Don't worry! We are adding more. Let us know which city you want to see next.{" "}
        <a href="/contact-form" className="contact-link">Contact us now!</a>
      </footer>
    </div>
  );
};

export default CityCards;
