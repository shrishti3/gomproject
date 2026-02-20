import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FutureTech3D from './components/FutureTech3D';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import './styles/globals.css';

function App() {
  return (
    <div className="min-h-screen bg-tactical-black text-stainless-steel">
      <Navbar />
      <Hero />
      <FutureTech3D />
      <Services />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
