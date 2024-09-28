import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

const ScreenRecorder: React.FC = () => {
  const [sources, setSources] = useState<Array<{ id: string; name: string; thumbnail: string }>>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ipcRenderer.invoke('GET_SCREEN_SOURCES').then(setSources);

    ipcRenderer.on('SCREEN_CAPTURE_SOURCE', (event, sourceId) => {
      startRecording(sourceId);
    });

    ipcRenderer.on('SCREEN_CAPTURE_ERROR', (event, errorMessage) => {
      setError(errorMessage);
    });

    return () => {
      ipcRenderer.removeAllListeners('SCREEN_CAPTURE_SOURCE');
      ipcRenderer.removeAllListeners('SCREEN_CAPTURE_ERROR');
    };
  }, []);

  const startRecording = async (sourceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
          }
        } as MediaTrackConstraints,
      });

      // Handle the stream (e.g., save to file, display in video element, etc.)
      console.log('Recording started', stream);
      setRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording: ' + error.message);
    }
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    ipcRenderer.send('START_SCREEN_CAPTURE', sourceId);
  };

  return (
    <div>
      <h2>Screen Recorder</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!recording ? (
        <div>
          <h3>Select a source to record:</h3>
          <ul>
            {sources.map(source => (
              <li key={source.id} onClick={() => handleSourceSelect(source.id)}>
                <img src={source.thumbnail} alt={source.name} width="100" />
                <p>{source.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Recording in progress...</p>
      )}
    </div>
  );
};

export default ScreenRecorder;