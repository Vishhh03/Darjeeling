import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar'; // Adjust path if needed
import Video from '../components/Video';   // Adjust path if needed

// Main Component
export default function RefinedVideoComponents() {
  useEffect(() => {
    // Register GSAP plugins once globally
    gsap.registerPlugin(ScrollTrigger);
    // console.log("GSAP and ScrollTrigger registered.");

    if (!gsap.utils.checkPrefix("requestVideoFrameCallback")) {
        console.warn("requestVideoFrameCallback API not fully supported. Video looping might be affected.");
    }
  }, []);

  return (
    <div className="relative bg-black">
      <Navbar />
      <Video />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          overflow-x: hidden;
          background-color: #000;
          color: #fff;
          margin: 0; /* Basic reset */
        }
        /* Fallback for backdrop-blur */
        @supports not (backdrop-filter: blur(1px)) {
          .backdrop-blur-xl { background-color: rgba(0,0,0,0.9); }
          .backdrop-blur-md { background-color: rgba(0,0,0,0.6); }
          .VideoText .backdrop-blur-md { background-color: rgba(255,255,255,0.1); }
        }
      `}</style>
    </div>
  );
}