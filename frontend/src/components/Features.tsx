'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: '🔍',
    title: 'Property Search',
    description: 'AI-powered property discovery that finds hidden gems matching your exact criteria.',
    gradient: 'from-blue-400 to-purple-600'
  },
  {
    icon: '📋',
    title: 'Floor Plan Upload',
    description: 'Simply upload any floor plan and watch our AI analyze and optimize the space instantly.',
    gradient: 'from-purple-400 to-pink-600'
  },
  {
    icon: '🎨',
    title: 'Layout Design',
    description: 'Create stunning layouts with AI suggestions that maximize space and functionality.',
    gradient: 'from-pink-400 to-red-600'
  },
  {
    icon: '🪑',
    title: 'Furniture Placement',
    description: 'Intelligent furniture arrangement that considers traffic flow and design principles.',
    gradient: 'from-red-400 to-orange-600'
  },
  {
    icon: '🏗️',
    title: 'Zoning Changes',
    description: 'Visualize zoning modifications and their impact on your property development.',
    gradient: 'from-orange-400 to-yellow-600'
  },
  {
    icon: '💰',
    title: 'Cost Estimation',
    description: 'Get accurate renovation estimates with detailed breakdowns and timeline projections.',
    gradient: 'from-yellow-400 to-green-600'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Everything you need to{' '}
            <span className="gradient-text">revolutionize</span>
            {' '}real estate
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From property discovery to renovation planning, our AI handles every aspect 
            of real estate development with unprecedented precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full glass-effect rounded-2xl p-8 card-hover">
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect line */}
                <div className={`h-1 w-0 bg-gradient-to-r ${feature.gradient} mt-6 group-hover:w-full transition-all duration-300 rounded`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass-effect rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-6">
              The future of real estate is{' '}
              <span className="gradient-text">intelligent</span>
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers, designers, and investors who are already 
              using RED AI to transform how they work with properties.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Building Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 