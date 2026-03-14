import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Target, Rocket } from 'lucide-react';

export default function About() {
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

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-tactical-black text-stainless-steel pt-20">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay"></div>

      {/* Animated background elements */}
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }}
        animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)' }}
        animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container-tactical">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-caution-yellow border-opacity-50 text-xs font-tech uppercase tracking-widest text-caution-yellow">
                ⚡ Founded 1989
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl font-tech font-bold leading-tight mb-6"
            >
              <span className="neon-text">About Madmann</span>
              <br />
              <span className="text-stainless-steel">Electronics</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-stainless-steel mb-8 max-w-3xl leading-relaxed"
            >
              A legacy of innovation and precision engineering spanning over three decades. 
              From humble beginnings to becoming a pioneer of semiconductors in South India.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Beginning Section */}
      <section className="relative z-10 py-20 border-t border-caution-yellow border-opacity-20">
        <div className="container-tactical">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-caution-yellow" />
                <h2 className="text-4xl font-tech font-bold neon-text">Our Beginning</h2>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-caution-yellow to-transparent"></div>
            </motion.div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={sectionVariants}
                className="space-y-6 text-stainless-steel leading-relaxed"
              >
                <p>
                  Founded in 1989 by two brothers, Darshan Electronics began its journey in a humble 100 sqft. space. 
                  Sunil, a HAL-trained engineer, and Sanjay, experienced in the existing electronics business, laid the 
                  groundwork for what is now a pioneer of semiconductors in South India.
                </p>
                <p>
                  They are proud to have introduced groundbreaking inventions - like the first IGBT sold in South India. 
                  Having supplied to all PSUs and most electronic manufacturers in Bangalore, our company has not only a 
                  legacy of trust but also a responsibility to the growth and innovation of this industry and country.
                </p>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                className="space-y-6 text-stainless-steel leading-relaxed"
              >
                <p>
                  We branched out from Bombay Sales Corporation (est. 1960s) started by the first generation during the 
                  invention of the transistor. Since then, our family has entered into numerous associated electronic and 
                  electrical businesses, one of the oldest of which is Darshan Electronics.
                </p>
                <p>
                  Our closest sister concern is Om Technology Centre, famously known for robotics. This network of expertise 
                  strengthens our position as a comprehensive electronics solutions provider.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Growth Section */}
      <section className="relative z-10 py-20 border-t border-caution-yellow border-opacity-20">
        <div className="container-tactical">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-caution-yellow" />
                <h2 className="text-4xl font-tech font-bold neon-text">Our Growth</h2>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-caution-yellow to-transparent"></div>
            </motion.div>

            {/* Content */}
            <motion.div variants={sectionVariants} className="max-w-4xl">
              <p className="text-lg text-stainless-steel leading-relaxed mb-6">
                The onset of the technology boom in the early 1990s, paved the way for Darshan Electronics to emerge as 
                a leading supplier to a wide range of companies. We became a key player in the supply chain of many 
                manufacturers in power electronics, telecommunications, aerospace, defence, medical equipment and general 
                manufacturing industries.
              </p>

              {/* Key Industries Grid */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
              >
                {[
                  'Power Electronics',
                  'Telecommunications',
                  'Aerospace & Defence',
                  'Medical Equipment',
                  'General Manufacturing',
                  'Semiconductor Supply'
                ].map((industry, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-4 rounded border border-caution-yellow border-opacity-30 hover:border-opacity-100 transition-all"
                  >
                    <span className="text-sm font-tech text-caution-yellow uppercase tracking-wider">
                      ► {industry}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Future Section */}
      <section className="relative z-10 py-20 border-t border-caution-yellow border-opacity-20">
        <div className="container-tactical">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex items-center space-x-3 mb-4">
                <Rocket className="w-6 h-6 text-caution-yellow" />
                <h2 className="text-4xl font-tech font-bold neon-text">Our Future</h2>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-caution-yellow to-transparent"></div>
            </motion.div>

            {/* Content */}
            <motion.div variants={sectionVariants} className="max-w-4xl">
              <p className="text-lg text-stainless-steel leading-relaxed mb-6">
                The company now aims to further its position in this new era of technology where India, and particularly 
                Bangalore stands tall in innovation and industrial advancements. The goal is to make Indian technology 
                available to the world and the roadmap to that is through promoting only Made-in-India components.
              </p>
              <p className="text-xl font-tech text-caution-yellow animate-pulse-glow">
                The future of technological prowess is here—with Darshan Electronics.
              </p>

              {/* Vision Cards */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              >
                {[
                  { title: 'Innovation', desc: 'Cutting-edge solutions for modern challenges' },
                  { title: 'Made-in-India', desc: 'Promoting indigenous component excellence' },
                  { title: 'Global Reach', desc: 'Bringing Indian tech to the world' },
                ].map((vision, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-6 rounded border border-tech-blue border-opacity-30 hover:border-opacity-100 transition-all group"
                  >
                    <h4 className="text-lg font-tech font-bold text-tech-blue mb-2 group-hover:text-caution-yellow transition-colors">
                      {vision.title}
                    </h4>
                    <p className="text-sm text-stainless-steel">{vision.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 border-t border-caution-yellow border-opacity-20">
        <div className="container-tactical">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-tech font-bold text-caution-yellow mb-6">
              Ready to partner with us?
            </h3>
            <p className="text-stainless-steel mb-8 max-w-2xl mx-auto">
              Let's build the future of electronics manufacturing together. 
              Connect with our team today.
            </p>
            <Link to="#contact" className="btn-tactical">
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
