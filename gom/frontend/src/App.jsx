import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import './styles/globals.css';

function App() {
  return (
    <div className="min-h-screen bg-tactical-black text-stainless-steel">
      <Navbar />
      <Hero />
      <Services />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
