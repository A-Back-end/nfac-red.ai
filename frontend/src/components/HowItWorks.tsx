'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '1',
    title: 'Upload Your Vision',
    description: 'Share your floor plans, property details, or design ideas. Our AI instantly understands your requirements.',
    icon: '📤',
    color: 'from-blue-400 to-purple-600'
  },
  {
    number: '2',
    title: 'AI Analysis',
    description: 'Advanced algorithms analyze space, optimize layouts, and generate intelligent design recommendations.',
    icon: '🧠',
    color: 'from-purple-400 to-pink-600'
  },
  {
    number: '3',
    title: 'Design & Visualize',
    description: 'See your space transformed with 3D visualizations, furniture placement, and renovation options.',
    icon: '🎨',
    color: 'from-pink-400 to-red-600'
  },
  {
    number: '4',
    title: 'Execute & Build',
    description: 'Get detailed plans, cost estimates, and contractor recommendations to bring your vision to life.',
    icon: '🏗️',
    color: 'from-red-400 to-orange-600'
  }
]

export default function HowItWorks() {
  return (
    <section id="howitworks" className="py-24 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            How <span className="gradient-text">RED AI</span> Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From concept to completion in four simple steps. 
            Experience the power of AI-driven real estate development.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-orange-400 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Content */}
                <div className="text-center">
                  {/* Step Number with Icon */}
                  <div className="relative mx-auto mb-8">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto relative z-10`}>
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -left-2 w-24 h-24 rounded-full border-2 border-white/20 animate-pulse"></div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm z-20">
                      {step.number}
                    </div>
                  </div>

                  {/* Step Info */}
                  <div className="glass-effect rounded-2xl p-6 h-full">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to transform your{' '}
              <span className="gradient-text">real estate process</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Start with a free account and see how AI can revolutionize 
              your property development workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4"
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 