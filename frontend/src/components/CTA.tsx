'use client'

export default function CTA() {
  return (
      <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center transition-all duration-1000 ease-out">
          <div className="glass-effect rounded-3xl p-12 lg:p-20 max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-300/30 mb-8 transform transition-all duration-500 hover:scale-105">
              <span className="text-lg font-semibold text-purple-300">🚀 Join the Revolution</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight transition-all duration-700 ease-out">
              Ready to build something{' '}
              <span className="gradient-text animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                extraordinary
              </span>
              ?
            </h2>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-opacity duration-800 ease-out">
              Join thousands of developers, designers, and investors who are already using RED AI 
              to transform their real estate projects. Start your free trial today.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 transition-all duration-1000 ease-out">
              {[
                { number: '10,000+', label: 'Projects Completed' },
                { number: '500M+', label: 'Sq Ft Designed' },
                { number: '98%', label: 'Client Satisfaction' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 transition-all duration-1000 ease-out">
              <a
                href="/auth.html"
                className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-purple-500/25 inline-block hover:scale-105 transition-transform"
              >
                Start Free Trial
              </a>
              
              <button
                className="btn-secondary text-xl px-12 py-5 flex items-center space-x-3 hover:scale-105 transition-transform"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Schedule Demo</span>
              </button>
            </div>

            {/* Trust Badge */}
            <div className="text-center transition-opacity duration-1000 ease-out">
              <p className="text-sm text-gray-400 mb-4">No credit card required • 14-day free trial • Cancel anytime</p>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-300">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-300">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-300">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
              </div>
      </section>
    )
} 