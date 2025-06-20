import React, { useRef, useEffect } from 'react';

export default function Video() {
  const videoRef = useRef(null);
  const animationFrameRef = useRef();

  // Segment Data
//   const segments = {
//     initial: { start: 0, end: 6 },
//     initialLoop: { start: 2, end: 6 },
//     action: { start: 6, end: 8 },
//     actionLoop: { start: 8, end: 12 }
//   };

    const segments = {
        initial: { start: 0, end: 5.6 },
        initialLoop: { start: 4.4, end: 5.6 },
        action: { start: 3, end: 5 },
        actionLoop: { start: 4, end: 5 }
  };


  const currentSegment = useRef('initial');

  // Loop checker
  const loopSegment = () => {
    const video = videoRef.current;
    if (!video) return;

    const { start, end } = segments[currentSegment.current + 'Loop'];

    if (video.currentTime >= end) {
      video.currentTime = start;
    }

    animationFrameRef.current = requestAnimationFrame(loopSegment);
  };

  // Start Initial Segment & Loop
  const startInitial = () => {
    const video = videoRef.current;
    if (!video) return;

    currentSegment.current = 'initial';
    video.currentTime = segments.initial.start;
    video.play();

    // Wait until end, then start loop
    const handle = () => {
      if (video.currentTime >= segments.initial.end) {
        video.removeEventListener('timeupdate', handle);
        currentSegment.current = 'initial';
        loopSegment();
      }
    };
    video.addEventListener('timeupdate', handle);
  };

  // Play Action → Loop Action
  const startAction = () => {
    const video = videoRef.current;
    if (!video) return;

    cancelAnimationFrame(animationFrameRef.current);
    currentSegment.current = 'action';
    video.currentTime = segments.action.start;
    video.play();

    // Wait until action ends, then loop actionLoop
    const handle = () => {
      if (video.currentTime >= segments.action.end) {
        video.removeEventListener('timeupdate', handle);
        currentSegment.current = 'action';
        loopSegment();
      }
    };
    video.addEventListener('timeupdate', handle);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      startInitial();
    };

    video.addEventListener('loadedmetadata', onLoaded);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        src="/assets/videos/video2.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75 z-0"
        preload="auto"
        controls={false}
        muted
        playsInline
        
      />
        <div className="relative z-10 px-6 md:px-36 pt-52 md:pt-40 max-w-4xl">
            {/* Headline */}
            <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight">
                Darjeeling Luxury <br />
                Resort Getaway
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-lg md:text-2xl text-white/80 font-light">
                A peaceful retreat surrounded by nature in the heart of Darjeeling. Luxury meets tranquility.
            </p>

            {/* CTA Button */}
            <div className="mt-6">
                <button className="px-6 py-3 bg-white text-black rounded-full font-semibold shadow hover:bg-opacity-90 transition">
                View Container
                </button>
            </div>

            {/* Location */}
            <div className="mt-6 flex items-center gap-2 text-white text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                </svg>
                Darjeeling, Hyderabad, India
            </div>

            {/* Distance Info Bar */}
            <div className="mt-8 grid grid-cols-3 gap-6 text-white text-sm md:text-base font-medium border-t border-white/30 pt-4 max-w-2xl">
                <div>
                <p className="text-2xl font-bold">0.2 km</p>
                <p>to shops</p>
                </div>
                <div>
                <p className="text-2xl font-bold">3 km</p>
                <p>to city center</p>
                </div>
                <div>
                <p className="text-2xl font-bold">0.3 km</p>
                <p>to tea gardens</p>
                </div>
            </div>
            </div>


    </div>
  );
}
