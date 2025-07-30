import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all necessary components
import Navbar from './components/Navbar';
import BlogLayout from './components/BlogLayout';
import BlogPage from './pages/BlogPage'; // Using the correct component from the 'pages' folder
import ScrollToTop from './components/ScrollToTop';

import './App.css';

function App() {
  return (
    <div className="App">
      {/* The Navbar will appear on all pages */}
      <Navbar />
      
      {/* This component handles scrolling to the top on every navigation */}
      <ScrollToTop />
      
      {/* The Routes define which component to show for each URL */}
      <Routes>
        <Route path="/" element={<BlogLayout />} />
        <Route path="/blog/:id" element={<BlogPage />} />
      </Routes>
    </div>
  );
}

export default App;
