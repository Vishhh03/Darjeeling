import React, { useRef, useEffect } from 'react';

export default function Video() {
  const videoRef = useRef(null);
  const frameCallbackRef = useRef(null);
  const currentSegment = useRef('initial');

  // Segment Data
  const segments = {
    initial: { start: 0, end: 5.4 },
    initialLoop: { start: 4.5, end: 5.4 },
    action: { start: 5.71, end: 7.11 },
    actionLoop: { start: 7.11, end: 8.99 },
    zoomIntoContainer: { start: 3, end: 5 },
    zoomIntoContainerLoop: { start: 4, end: 5 },
    interiorZoom: { start: 1, end: 1 },
    interiorZoomLoop: { start: 1, end: 1 },
  };

  // Loop checker using requestVideoFrameCallback
  const loopSegment = () => {
    const video = videoRef.current;
    if (!video) return;

    const { start, end } = segments[currentSegment.current + 'Loop'];

    const checkLoop = () => {
      if (video.currentTime >= end) {
        video.currentTime = start;
      }

      frameCallbackRef.current = video.requestVideoFrameCallback(checkLoop);
    };

    // Cancel previous loop if active
    if (video.cancelVideoFrameCallback && frameCallbackRef.current) {
      video.cancelVideoFrameCallback(frameCallbackRef.current);
    }

    frameCallbackRef.current = video.requestVideoFrameCallback(checkLoop);
  };

  // Start the initial segment and then loop it
  const startInitial = () => {
    const video = videoRef.current;
    if (!video) return;

    currentSegment.current = 'initial';
    video.currentTime = segments.initial.start;
    video.play();

    const handle = () => {
      if (video.currentTime >= segments.initial.end) {
        video.removeEventListener('timeupdate', handle);
        loopSegment();
      }
    };

    video.addEventListener('timeupdate', handle);
  };

  // Start the action segment and then loop it
  const startAction = () => {
    const video = videoRef.current;
    if (!video) return;

    // Cancel previous video frame callback
    if (video.cancelVideoFrameCallback && frameCallbackRef.current) {
      video.cancelVideoFrameCallback(frameCallbackRef.current);
    }

    currentSegment.current = 'action';
    video.currentTime = segments.action.start;
    video.play();

    const handle = () => {
      if (video.currentTime >= segments.action.end) {
        video.removeEventListener('timeupdate', handle);
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
      if (video.cancelVideoFrameCallback && frameCallbackRef.current) {
        video.cancelVideoFrameCallback(frameCallbackRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        src="/assets/videos/compressed.webm"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75 z-0"
        preload="auto"
        controls={false}
        muted
        playsInline
      />
    </div>
  );
}
