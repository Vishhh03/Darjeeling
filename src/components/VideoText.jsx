import React, { useEffect, useState } from 'react';

// Dynamic Video Text Component
function VideoText({ currentSectionIndex }) { // Renamed prop for clarity
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 150); // Small delay for fade-in/up
    return () => clearTimeout(timer);
  }, [currentSectionIndex]); // Re-trigger animation when section index changes

  const content = { // Indexed by number (0, 1, 2, 3)
    0: {
      title: "Darjeeling Luxury Resort",
      subtitle: "Where luxury meets serenity in the heart of Darjeeling's misty mountains.",
      description: "Experience the perfect harmony of modern comfort and natural beauty.",
      features: []
    },
    1: {
      title: "Luxury Amenities",
      subtitle: "Indulge in world-class facilities designed for ultimate relaxation.",
      description: "Every detail crafted for your comfort, from serene pools to exquisite dining.",
      features: [
        { icon: "🏊‍♀️", title: "Infinity Pool", desc: "Overlooking tea gardens" },
        { icon: "🧘‍♀️", title: "Spa & Wellness", desc: "Rejuvenating treatments" },
        { icon: "🍽️", title: "Fine Dining", desc: "Michelin-starred cuisine" }
      ]
    },
    2: {
      title: "Premium Experiences",
      subtitle: "Curated adventures and breathtaking views await your discovery.",
      description: "Discover the essence of Darjeeling through exclusive local experiences.",
      features: [
        { icon: "🌅", title: "Sunrise Views", desc: "From Tiger Hill observatory" },
        { icon: "🚂", title: "Heritage Railway", desc: "UNESCO World Heritage ride" },
        { icon: "🍃", title: "Tea Plantation", desc: "Private garden tours" }
      ],
      showButton: true
    },
    3: {
      title: "Your Private Sanctuary",
      subtitle: "Step inside luxury redefined, where elegance meets tranquility.",
      description: "Explore meticulously designed spaces that blend opulent comfort with timeless style.",
      features: []
    }
  };

  const currentContent = content[currentSectionIndex] || content[0]; // Fallback to first section

  return (
    // This container itself is an overlay. Z-index 20
    <div className="absolute inset-0 z-20 flex items-center justify-center text-center md:justify-start md:text-left pointer-events-none">
      <div className="px-6 md:px-12 lg:px-24 max-w-4xl w-full"> {/* Max width for content */}
        <div className={`transform transition-all duration-1000 ease-out ${ // Added ease-out
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0' // Increased translate-y
        }`}>
          {/* Title */}
          <div className="relative mb-6 md:mb-8"> {/* Adjusted margin */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight md:leading-none tracking-tight">
              {currentContent.title.split(' ').map((word, index) => (
                <span key={index} className="inline-block mr-2 md:mr-4 drop-shadow-lg">
                  <span
                    className={`inline-block transition-all duration-700 ease-out ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    } ${word.toLowerCase().includes('luxury') ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent' : ''}`}
                    style={{ transitionDelay: `${100 + index * 120}ms` }} // Adjusted delay
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
            <div className={`mt-3 md:mt-4 flex items-center justify-center md:justify-start space-x-3 md:space-x-4 transition-all duration-1000 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0' // Changed to -translate-x
            }`} style={{ transitionDelay: `${200 + currentContent.title.split(' ').length * 100}ms`}}>
              <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-amber-300 to-orange-500"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Subtitle */}
          <div className={`mb-6 md:mb-8 transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`} style={{ transitionDelay: `${300 + currentContent.title.split(' ').length * 100}ms`}}>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto md:mx-0 drop-shadow-md">
              {currentContent.subtitle}
            </p>
          </div>

          {/* Description (optional, can be hidden on smaller screens if too much text) */}
          {currentContent.description && (
            <div className={`mb-8 md:mb-12 transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`} style={{ transitionDelay: `${400 + currentContent.title.split(' ').length * 100}ms`}}>
              <p className="text-base sm:text-lg md:text-xl text-white/80 font-normal max-w-2xl mx-auto md:mx-0 leading-relaxed drop-shadow-sm">
                {currentContent.description}
              </p>
            </div>
          )}
          

          {/* Features Grid */}
          {currentContent.features && currentContent.features.length > 0 && (
            <div className={`mb-8 md:mb-12 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0' // Simpler opacity, individual items animate y
            }`} style={{ transitionDelay: `${500 + currentContent.title.split(' ').length * 100}ms`}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto md:mx-0">
                {currentContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className={`group p-4 md:p-6 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-amber-300/30 transition-all duration-500 hover:scale-105 pointer-events-auto transform ${ // Added transform for individual animation
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${500 + currentContent.title.split(' ').length * 100 + (index * 150)}ms` }}
                  >
                    <div className="text-2xl md:text-3xl mb-2 md:mb-3 text-amber-300 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold text-base md:text-lg mb-1 md:mb-2 group-hover:text-amber-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm group-hover:text-white/80 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Button */}
          {currentContent.showButton && (
            <div className={`transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: `${600 + currentContent.title.split(' ').length * 100 + (currentContent.features.length > 0 ? currentContent.features.length * 150 : 0)}ms`}}>
              <button className="group relative px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-bold text-sm md:text-base lg:text-lg rounded-full overflow-hidden shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-110 active:scale-95 pointer-events-auto">
                <span className="relative z-10 flex items-center space-x-2 md:space-x-3">
                  <span>Explore Further</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default VideoText;