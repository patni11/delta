"use client"
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch"

const ScreenCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  function stopCapture(){
    setIsCapturing(false);
  }

  function startCapture(){
    setIsCapturing(true);
  }

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