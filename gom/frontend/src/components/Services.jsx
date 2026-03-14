import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, TrendingUp, Cpu, Zap } from 'lucide-react';
import { getProjects } from '../utils/apiClient';

const Services = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data || []);
      } catch (error) {
        console.log('Using default service data');
        // Use default if API fails
        setProjects([
          {
            _id: '1',
            category: 'ODM',
            projectName: 'Aerospace Component Manufacturing',
            description: 'High-precision components for commercial and defense applications',
          },
          {
            _id: '2',
            category: 'SCM',
            projectName: 'Electronics Sourcing Initiative',
            description: 'Strategic component sourcing from Indian manufacturing partners',
          },
          {
            _id: '3',
            category: 'EMS',
            projectName: 'Full-Cycle EMS Production',
            description: 'From prototype to mass production electronics manufacturing',
          },
          {
            _id: '4',
            category: 'Wire Harnessing',
            projectName: 'Defense Wire Harnessing',
            description: 'Specialized wire solutions for automotive, EV, and defense sectors',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const serviceIcons = {
    ODM: Rocket,
    SCM: TrendingUp,
    EMS: Cpu,
    'Wire Harnessing': Zap,
  };

  const serviceColors = {
    ODM: 'from-caution-yellow to-orange-600',
    SCM: 'from-tech-blue to-tech-cyan',
    EMS: 'from-purple-500 to-pink-500',
    'Wire Harnessing': 'from-green-500 to-emerald-600',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="services"
      className="py-20 bg-tactical-black relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 grid-overlay"></div>
      
      <div className="container-tactical relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-xs font-tech uppercase tracking-widest text-caution-yellow mb-2">
            ◆ Our Core Pillars
          </span>
          <h2 className="text-4xl md:text-5xl font-tech font-bold text-stainless-steel mb-4">
            Strategic <span className="neon-text">Capabilities</span>
          </h2>
          <p className="text-stainless-steel max-w-2xl">
            Four core pillars of excellence driving innovation in aerospace, defense, and electronics.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {loading ? (
            <div className="col-span-full text-center text-stainless-steel">Loading services...</div>
          ) : (
            projects.map((service) => {
              const IconComponent = serviceIcons[service.category] || Rocket;
              const gradient = serviceColors[service.category] || 'from-caution-yellow to-orange-600';

              return (
                <motion.div
                  key={service._id}
                  variants={itemVariants}
                  className="group relative"
                  whileHover={{ y: -10 }}
                >
                  {/* Card */}
                  <div className="relative p-8 rounded-lg border border-caution-yellow border-opacity-20 bg-tactical-dark-grey hover:border-opacity-50 transition-all duration-300 overflow-hidden">
                    {/* Gradient accent */}
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}
                    ></div>

                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} p-2.5 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-full h-full text-tactical-black" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-tech font-bold text-caution-yellow mb-3">
                      {service.category}
                    </h3>
                    <p className="text-sm text-stainless-steel mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Project name if available */}
                    {service.projectName && (
                      <p className="text-xs text-caution-yellow font-mono opacity-70">
                        {service.projectName}
                      </p>
                    )}

                    {/* Arrow */}
                    <motion.div
                      className="mt-6 inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-caution-yellow">→</span>
                    </motion.div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 border border-caution-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            {
              title: 'End-to-End',
              desc: 'From ideation to production scaling',
            },
            {
              title: 'Precision-Focused',
              desc: 'Defense and aerospace grade standards',
            },
            {
              title: 'Cost-Optimized',
              desc: 'Indian manufacturing alternatives',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded border border-tactical-dark-grey hover:border-caution-yellow transition-all"
              whileHover={{ x: 5 }}
            >
              <h4 className="font-tech font-bold text-caution-yellow mb-2">{item.title}</h4>
              <p className="text-sm text-stainless-steel">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
