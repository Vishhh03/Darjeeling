import React, { useEffect, useState } from 'react';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentNavSection, setCurrentNavSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // --- Navbar Active State Logic ---
      // This logic determines which nav item is highlighted.
      // It needs to be aware of the video segments and the actual page sections.
      const videoSectionCount = 4; // Number of main video segments
      const sectionHeight = window.innerHeight;
      let activeSectionId = 'intro';

      if (scrollY < sectionHeight * videoSectionCount) {
        // We are within the video's pinned area or before it fully unpins
        const videoSegmentIndex = Math.min(Math.floor(scrollY / sectionHeight), videoSectionCount - 1);
        const videoSegmentIds = ['intro', 'features1', 'features2', 'container']; // Matches Video.jsx mainSegments
        activeSectionId = videoSegmentIds[videoSegmentIndex];
      } else {
        // We are past the video section, check actual page sections
        const pageSections = ['features1', 'features2', 'container', 'about']; // IDs of sections *after* video
        // Find the topmost visible section (adjust offset as needed)
        for (let i = pageSections.length - 1; i >= 0; i--) {
            const el = document.getElementById(pageSections[i]);
            if (el) {
                const rect = el.getBoundingClientRect();
                // Consider a section active if its top is within the top 2/3 of the viewport
                if (rect.top <= window.innerHeight * (2/3) && rect.bottom >= window.innerHeight * (1/3)) {
                    activeSectionId = pageSections[i];
                    break;
                }
            }
        }
        // If no specific page section is active but we are past video, default to last video segment or 'about'
        if (activeSectionId === 'intro' && scrollY >= sectionHeight * videoSectionCount) {
             activeSectionId = 'about'; // Or a more sophisticated "last known section"
        }
      }
      setCurrentNavSection(activeSectionId);
      // --- End Navbar Active State Logic ---

      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      if (maxScroll > 0) {
        setScrollProgress((scrollY / maxScroll) * 100);
      } else {
        setScrollProgress(scrollY > 0 ? 100 : 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'GALLERY', id: 'intro', active: currentNavSection === 'intro' },
    { name: 'FEATURES', id: 'features1', active: currentNavSection === 'features1' || currentNavSection === 'features2' },
    { name: 'LOCATION', id: 'container', active: currentNavSection === 'container' },
    { name: 'ABOUT US', id: 'about', active: currentNavSection === 'about' }
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-700 ${
      isScrolled
        ? 'bg-black/90 backdrop-blur-xl shadow-2xl py-2'
        : 'bg-gradient-to-b from-black/60 to-transparent backdrop-blur-md py-4'
    }`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#intro" className="group cursor-pointer">
            <div className="relative">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider transition-all duration-300 group-hover:text-amber-300">
                DARJEELING
              </h1>
              <div className="text-xs text-amber-300 font-light tracking-[0.3em] opacity-80 group-hover:opacity-100 transition-opacity">
                LUXURY RESORT
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-300 to-amber-500 group-hover:w-full transition-all duration-500"></div>
            </div>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`} // Ensure these IDs exist on the page
                className={`relative font-medium text-sm tracking-wide transition-all duration-300 group ${
                  item.active ? 'text-amber-300' : 'text-white hover:text-amber-300'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-300 transition-all duration-300 ${
                  item.active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="group relative px-6 py-2.5 border-2 border-white/40 text-white font-semibold text-sm rounded-full overflow-hidden transition-all duration-300 hover:border-amber-300 hover:shadow-amber-300/20 hover:shadow-lg">
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">VIEW BROCHURE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-sm rounded-full overflow-hidden shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
              <span className="relative z-10">CONTACT US</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          <button
            className="md:hidden text-white p-2 hover:text-amber-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-4 border-t border-white/20 mt-4">
            {navItems.map((item) => (
              <a key={item.name} href={`#${item.id}`} className={`block font-medium py-2 transition-colors ${
                item.active ? 'text-amber-300' : 'text-white hover:text-amber-300'
              }`} onClick={() => setIsMobileMenuOpen(false)}>
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <button className="w-full px-6 py-3 border border-white/40 text-white font-semibold rounded-full hover:border-amber-300 transition-colors">
                VIEW BROCHURE
              </button>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-full hover:from-amber-500 hover:to-amber-700 transition-all">
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-150"
          style={{ width: `${Math.min(scrollProgress, 100)}%` }}
        ></div>
      </div>
    </nav>
  );
}
export default Navbar;