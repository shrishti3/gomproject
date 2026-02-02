import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Cog, Shield } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const glitchVariants = {
    initial: { textShadow: '0 0 0 rgba(255, 215, 0, 0)' },
    animate: {
      textShadow: [
        '0 0 10px rgba(255, 215, 0, 0.5)',
        '0 0 20px rgba(255, 215, 0, 0.8)',
        '0 0 10px rgba(255, 215, 0, 0.5)',
      ],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen bg-tactical-black pt-20 flex items-center relative overflow-hidden"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay"></div>

      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)' }}
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-tactical relative z-10 py-20">
        <motion.div
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-caution-yellow border-opacity-50 text-xs font-tech uppercase tracking-widest text-caution-yellow">
              ⚡ Next-Gen Manufacturing
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-tech font-bold leading-tight mb-6"
          >
            <motion.span
              variants={glitchVariants}
              initial="initial"
              animate="animate"
              className="neon-text"
            >
              MADMANN
            </motion.span>
            <br />
            <span className="text-stainless-steel">DYNAMICS</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-stainless-steel mb-8 max-w-2xl"
          >
            Pushing the boundaries of aerospace, defense, and electronics. From concept to
            production—we engineer the impossible with unconventional precision.
          </motion.p>

          {/* Features */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            {[
              { icon: Zap, text: 'High-Stakes Innovation' },
              { icon: Cpu, text: 'Precision Engineering' },
              { icon: Cog, text: 'Full Lifecycle Production' },
              { icon: Shield, text: 'Defense-Grade Solutions' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center space-x-3 p-3 rounded border border-caution-yellow border-opacity-20 hover:border-opacity-50 transition-all"
                whileHover={{ x: 5 }}
              >
                <feature.icon className="w-5 h-5 text-caution-yellow flex-shrink-0" />
                <span className="text-sm font-tech text-stainless-steel">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#contact"
              className="btn-tactical inline-block text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Initiate Inquiry
            </motion.a>
            <motion.a
              href="#services"
              className="btn-tactical-outline inline-block text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Services
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-caution-yellow border-opacity-20"
          >
            {[
              { value: '200+', label: 'Projects Delivered' },
              { value: '50+', label: 'Industry Partners' },
              { value: '99.8%', label: 'Quality Standard' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-tech font-bold text-caution-yellow">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-stainless-steel mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs font-tech uppercase text-caution-yellow">Scroll</span>
          <div className="w-6 h-10 border-2 border-caution-yellow rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-caution-yellow rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
