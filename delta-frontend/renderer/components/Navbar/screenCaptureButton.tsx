"use client"
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch"

const ScreenCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for capture status changes
    window.electronAPI.onCaptureStatus((event, status) => {
      setIsCapturing(status);
    });

    // Listen for capture errors
    window.electronAPI.onCaptureError((event, errorMessage) => {
      setError(errorMessage);
    });
  }, []);

  const startCapture = async () => {
    setError(null);
    const result = await window.electronAPI.startScreenCapture();
    if (result.success) {
      try {
        const constraints: any = {
          audio: false,
          video: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: result.sourceId,
            width: { ideal: window.screen.width },
            height: { ideal: window.screen.height }
          }
        };
  
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
        // Here you can use the stream, e.g., display it in a video element
        // or use it with a MediaRecorder to record video
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError(result.message);
    }
  };
  

  const stopCapture = async () => {
    const result = await window.electronAPI.stopScreenCapture();
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div>
      <Switch
    checked={isCapturing}
    onCheckedChange={isCapturing ? stopCapture : startCapture}
  />

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ScreenCapture;