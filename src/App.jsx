import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AQIData from './components/AQIData';
import FetchAQI from './components/pages/FetchAQI';
import Spinner from './components/layouts/Spinner';
import ViewUserAQI from './components/pages/ViewUserAQI';
import ViewAQI from './components/pages/ViewAQI';
import HistoricalAQI from './components/pages/HistoricalAQI';
import CityCards from './components/CityCards';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import HistoricalData from './components/pages/HistoricalData';
import AdminHero from './adminComponents/AdminHeroPage';
import ViewEngagement from './adminComponents/ViewEngagement';
import AddCities from './adminComponents/AddCities';
import ViewCities from './adminComponents/ViewCities';
import AddData from './adminComponents/AddData';
import Analytics from './components/pages/Analytics';
import Dashboard from './adminComponents/Dashboard';
import ResolveQueries from './adminComponents/ResolveQueries';
const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply theme to <html> tag
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (loading) return <Spinner />;
  return (
    <BrowserRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/view-past-aqis" element={<ViewAQI />} />
        <Route path="/fetch-aqi" element={<FetchAQI />} />
        <Route path="/view-user-aqis" element={<ViewUserAQI />} /> 
        {/* <Route path='/historical-data' element={<HistoricalAQI />} /> */}
        <Route path='/available-cities' element={<CityCards />} />
        <Route path='/contact-form' element={<ContactForm />} />
        {/* <Route path="/city/:cityName" element={<HistoricalDataPage />} /> */}
        <Route path="/historical-data" element={<HistoricalData />} />
        <Route path='/admin' element={<AdminHero />} />
        <Route path='/view-engagement' element={<ViewEngagement />} />
        <Route path='/add-cities' element={<AddCities />} />
        <Route path="/view-existing-cities" element={<ViewCities />} /> {/* New Route */}
        <Route path='/add-data' element={<AddData />} />
        <Route path="/analytics/:city" element={<Analytics />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path='/resolve-queries' element={<ResolveQueries />} />
      </Routes>
    </BrowserRouter>
    
  );
};

export default App;
