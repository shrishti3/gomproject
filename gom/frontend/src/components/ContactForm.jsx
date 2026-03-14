import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitInquiry } from '../utils/apiClient';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: 'ODM',
    message: '',
    budget: '',
    timeline: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitInquiry(formData);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        serviceType: 'ODM',
        message: '',
        budget: '',
        timeline: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { label: 'Full Name', name: 'fullName', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Phone', name: 'phone', type: 'tel', required: false },
    { label: 'Company', name: 'company', type: 'text', required: false },
  ];

  const selectOptions = [
    { label: 'Timeline', name: 'timeline', options: ['less than 1 month', '1-3 months', '3-6 months', '6+ months'] },
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-tactical-black relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-overlay"></div>

      <div className="container-tactical relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-xs font-tech uppercase tracking-widest text-caution-yellow mb-2">
            ◆ Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-tech font-bold text-stainless-steel mb-4">
            Initiate <span className="neon-text">Contact</span>
          </h2>
          <p className="text-stainless-steel">
            Have a project in mind? Let's discuss how MadMann Dynamics can bring your vision to life.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-lg border border-caution-yellow border-opacity-20 bg-tactical-dark-grey"
          >
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded bg-green-900 bg-opacity-30 border border-green-500 text-green-400 text-sm font-tech"
              >
                ✓ Inquiry submitted successfully! We'll contact you soon.
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded bg-red-900 bg-opacity-30 border border-red-500 text-red-400 text-sm font-tech"
              >
                ✗ {error}
              </motion.div>
            )}

            {/* Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={field.name === 'email' ? 'md:col-span-2' : ''}
                >
                  <label className="block text-xs font-tech uppercase text-caution-yellow mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3 rounded bg-tactical-black border border-tactical-dark-grey text-stainless-steel font-mono text-sm focus:outline-none focus:border-caution-yellow focus:ring-1 focus:ring-caution-yellow transition-all"
                    placeholder={field.label}
                  />
                </motion.div>
              ))}
            </div>

            {/* Select Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Type */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-xs font-tech uppercase text-caution-yellow mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded bg-tactical-black border border-tactical-dark-grey text-stainless-steel font-mono text-sm focus:outline-none focus:border-caution-yellow focus:ring-1 focus:ring-caution-yellow transition-all"
                >
                  <option value="ODM">ODM - Aerospace & Defense</option>
                  <option value="SCM">SCM - Electronics Sourcing</option>
                  <option value="EMS">EMS - Full Production</option>
                  <option value="Wire Harnessing">Wire Harnessing</option>
                </select>
              </motion.div>

              {/* Budget */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="block text-xs font-tech uppercase text-caution-yellow mb-2">
                  Budget (in USD)
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full px-4 py-3 rounded bg-tactical-black border border-tactical-dark-grey text-stainless-steel font-mono text-sm focus:outline-none focus:border-caution-yellow focus:ring-1 focus:ring-caution-yellow transition-all"
                />
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label className="block text-xs font-tech uppercase text-caution-yellow mb-2">
                Timeline
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded bg-tactical-black border border-tactical-dark-grey text-stainless-steel font-mono text-sm focus:outline-none focus:border-caution-yellow focus:ring-1 focus:ring-caution-yellow transition-all"
              >
                <option value="">Select timeline</option>
                {selectOptions[0].options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label className="block text-xs font-tech uppercase text-caution-yellow mb-2">
                Project Details
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 rounded bg-tactical-black border border-tactical-dark-grey text-stainless-steel font-mono text-sm focus:outline-none focus:border-caution-yellow focus:ring-1 focus:ring-caution-yellow transition-all resize-none"
                placeholder="Describe your project, requirements, and goals..."
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-tactical disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}
            </motion.button>

            {/* Terms */}
            <p className="text-xs text-stainless-steel text-center">
              We'll review your inquiry and contact you within 48 hours.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
