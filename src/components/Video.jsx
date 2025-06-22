import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoText from './VideoText'; // Ensure path is correct

function Video() {
  const videoRef = useRef(null);
  const containerRef = useRef(null); // This is the element that will be pinned
  const frameCallbackRef = useRef(null);
  const timeUpdateHandlerRef = useRef(null);
  const currentSegmentNameRef = useRef('initial'); // Store the name of the segment
  const lastScrollTimeRef = useRef(Date.now());
  const scrollTimeoutRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  // Video segments configuration (times in seconds)
  const segments = {
    initial: { start: 0, end: 5.4 },
    initialLoop: { start: 4.5, end: 5.4 },
    action: { start: 5.71, end: 7.11 },
    actionLoop: { start: 7.11, end: 8.99 },
    zoomIntoContainer: { start: 3, end: 5 }, // Naming these to match what they show
    zoomIntoContainerLoop: { start: 4, end: 5 },
    interiorZoom: { start: 1, end: 1.1 }, // Needs distinct start/end for a tiny play
    interiorZoomLoop: { start: 1, end: 1.1 }, // Loop for the tiny play
  };

  // Main segments that correspond to distinct text overlays and scroll trigger points
  const mainSegmentNames = ['initial', 'action', 'zoomIntoContainer', 'interiorZoom'];

  const playVideoSegment = (segmentName) => {
    const video = videoRef.current;
    if (!video || !segments[segmentName]) {
      console.warn(`Video or segment ${segmentName} not found.`);
      return;
    }
    currentSegmentNameRef.current = segmentName;

    // Cancel any ongoing rVFC loop or timeupdate listener
    if (video.cancelVideoFrameCallback && frameCallbackRef.current) {
      video.cancelVideoFrameCallback(frameCallbackRef.current);
      frameCallbackRef.current = null;
    }
    if (timeUpdateHandlerRef.current) {
      video.removeEventListener('timeupdate', timeUpdateHandlerRef.current);
      timeUpdateHandlerRef.current = null;
    }

    const segmentTimes = segments[segmentName];
    video.currentTime = segmentTimes.start;
    video.play().catch(error => console.error(`Error playing segment ${segmentName}:`, error));

    // After the main segment plays, transition to its loop
    const onSegmentEnd = () => {
      if (video.currentTime >= segmentTimes.end - 0.1) { // 0.1s buffer
        video.removeEventListener('timeupdate', onSegmentEnd);
        timeUpdateHandlerRef.current = null;
        startLoopForCurrentSegment();
      }
    };
    video.addEventListener('timeupdate', onSegmentEnd);
    timeUpdateHandlerRef.current = onSegmentEnd;
  };

  const startLoopForCurrentSegment = () => {
    const video = videoRef.current;
    if (!video || !video.requestVideoFrameCallback) return;

    const loopSegmentKey = currentSegmentNameRef.current + 'Loop';
    const loopTimes = segments[loopSegmentKey];

    if (!loopTimes || loopTimes.start === loopTimes.end) { // No valid loop defined
      if (!video.paused) video.pause(); // Pause if no loop
      return;
    }

    if (video.cancelVideoFrameCallback && frameCallbackRef.current) {
      video.cancelVideoFrameCallback(frameCallbackRef.current);
    }

    const loopTick = () => {
      if (!video || video.paused || video.ended || video.seeking) {
         if (video && video.cancelVideoFrameCallback && frameCallbackRef.current) {
            video.cancelVideoFrameCallback(frameCallbackRef.current);
            frameCallbackRef.current = null;
         }
        return;
      }
      if (video.currentTime >= loopTimes.end - 0.1) {
        video.currentTime = loopTimes.start;
      }
      frameCallbackRef.current = video.requestVideoFrameCallback(loopTick);
    };

    if (!video.paused) { // Only start loop if video is playing
        frameCallbackRef.current = video.requestVideoFrameCallback(loopTick);
    }
  };

  useEffect(() => {
    // GSAP and ScrollTrigger setup
    if (!gsap || !ScrollTrigger || !containerRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const scrollContainer = containerRef.current;
    let stInstance; // To store ScrollTrigger instance for cleanup

    const initializeScrollTrigger = () => {
      stInstance = ScrollTrigger.create({
        trigger: scrollContainer,
        pin: true,
        start: "top top",
        // Total scroll duration for the pinned video will be (number of segments - 1) * viewport height
        end: () => `+=${window.innerHeight * (mainSegmentNames.length - 1)}`,
        scrub: false, // We handle playback, not scrubbing video time directly
        // markers: true, // Uncomment for debugging ScrollTrigger
        onUpdate: (self) => {
          // Determine which segment should be active based on scroll progress
          // self.scroll() is the amount scrolled since the trigger's start
          const pixelsPerSegment = window.innerHeight;
          const currentSegmentIdx = Math.min(
            Math.floor(self.scroll() / pixelsPerSegment + 0.1), // Add epsilon for boundaries
            mainSegmentNames.length - 1
          );
          
          setActiveSegmentIndex(prevIndex => {
            if (currentSegmentIdx !== prevIndex) {
              if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current); // Stop idle loop if scrolling
              playVideoSegment(mainSegmentNames[currentSegmentIdx]);
              return currentSegmentIdx;
            }
            return prevIndex;
          });
        },
      });
    };
    
    // Ensure video metadata is loaded before setting up ScrollTrigger,
    // as ScrollTrigger's `end` calculation might depend on it (though here it's vh-based).
    if (video.readyState >= 1) { // HAVE_METADATA
      initializeScrollTrigger();
    } else {
      video.addEventListener('loadedmetadata', initializeScrollTrigger, { once: true });
    }
    
    // Idle scroll detection for looping
    const handleIdleScrollLoop = () => {
        if (!video || video.seeking || video.paused) return; // Don't loop if video is not in a good state
        lastScrollTimeRef.current = Date.now();
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            if (Date.now() - lastScrollTimeRef.current >= 800) { // 800ms of no scroll
                startLoopForCurrentSegment();
            }
        }, 800);
    };
    window.addEventListener('scroll', handleIdleScrollLoop, { passive: true });

    return () => {
      if (stInstance) stInstance.kill();
      window.removeEventListener('scroll', handleIdleScrollLoop);
      if (video.cancelVideoFrameCallback && frameCallbackRef.current) {
        video.cancelVideoFrameCallback(frameCallbackRef.current);
      }
      if (timeUpdateHandlerRef.current) {
        video.removeEventListener('timeupdate', timeUpdateHandlerRef.current);
      }
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      video.removeEventListener('loadedmetadata', initializeScrollTrigger);
    };
  }, [mainSegmentNames.length]); // Rerun if the number of main segments changes

  useEffect(() => {
    // Initial video load and play
    const video = videoRef.current;
    if (!video) return;

    const onVideoLoaded = () => {
      setIsLoaded(true);
      playVideoSegment(mainSegmentNames[0]); // Play the first segment
    };
    const onVideoError = (e) => {
      console.error("Video loading error:", e);
      setIsLoaded(true);
    };

    if (video.readyState >= 1) { // If already loaded (e.g., from cache)
        onVideoLoaded();
    } else {
        video.addEventListener('loadedmetadata', onVideoLoaded, { once: true });
    }
    video.addEventListener('error', onVideoError, { once: true });

    return () => {
      video.removeEventListener('loadedmetadata', onVideoLoaded);
      video.removeEventListener('error', onVideoError);
    };
  }, [mainSegmentNames]); // Rerun if mainSegmentNames changes (to play new initial segment)

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* Loading Overlay */}
      <div className={`absolute inset-0 bg-black z-40 flex items-center justify-center transition-opacity duration-1000 ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        {/* ... loading spinner ... */}
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-300/20"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-amber-300 animate-spin"></div>
          </div>
          <p className="mt-6 text-white text-lg font-light tracking-wider">Loading Luxury Experience...</p>
        </div>
      </div>

      {/* Video Element */}
      <video
        ref={videoRef}
        src="/assets/videos/compressed.webm" 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.75) contrast(1.15) saturate(1.1)' }}
        preload="auto"
        muted
        playsInline
      />

      {/* Dynamic Gradient Overlays (Z-index 10) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {mainSegmentNames.map((_, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 
            ${activeSegmentIndex === index ? 'opacity-100' : 'opacity-0'} 
            ${index === 0 ? 'bg-gradient-to-b from-black/40 via-transparent to-black/60' : ''}
            ${index === 1 ? 'bg-gradient-to-r from-amber-900/20 via-transparent to-orange-900/20' : ''}
            ${index === 2 ? 'bg-gradient-to-t from-black/50 via-transparent to-amber-900/30' : ''}
            ${index === 3 ? 'bg-gradient-to-br from-black/40 via-transparent to-amber-800/40' : ''}
          `}></div>
        ))}
      </div>

      {/* Video Text Overlay (Z-index 20, above gradients) */}
      <VideoText currentSectionIndex={activeSegmentIndex} />

      {/* Section Indicator (Z-index 30, above text if needed, or adjust) */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 space-y-3">
        {mainSegmentNames.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-8 rounded-full transition-all duration-500 ${
              index === activeSegmentIndex
                ? 'bg-amber-300 shadow-amber-300/50 shadow-lg'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export default Video;