import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import About from './pages/About';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-tactical-black text-stainless-steel">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <ContactForm />
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
