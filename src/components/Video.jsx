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
        initial: { start: 0, end: 4 },
        initialLoop: { start: 3, end: 4 },
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
        src="/assets/videos/video.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75 z-0"
        preload="auto"
        controls={false}
        muted
        playsInline
        
      />
      <div className="relative z-10 flex justify-center items-center h-full">
        <button
          onClick={startAction}
          className="px-6 py-3 bg-white bg-opacity-80 rounded-md font-semibold hover:bg-opacity-100 transition"
        >
          Play Action
        </button>
      </div>
    </div>
  );
}
