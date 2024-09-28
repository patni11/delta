import path from 'path'
import { app, ipcMain, screen, desktopCapturer } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
const { writeFile } = require('fs');

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

// Global state
let mainWindow;
let isCapturing = false;
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];
//let isCapturingEnabled = false;

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

const filePath = `vid-${Date.now()}.webm`

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  }

}

// Change the videoSource window to record
async function selectSource(source) {

  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  const entireScreen = sources.find(source => source.name === 'Entire screen');


  const constraints:any = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Updates the UI
}

// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

(async () => {
  await app.whenReady()

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  mainWindow = createWindow('main', {
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    },
    frame: false,
    fullscreen: true,
  })

  if (isProd) {
    await mainWindow.loadURL('app://./')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  }

  // Handle start screen capture request
  ipcMain.handle('start-screen-capture', async () => {
    //if (isCapturingEnabled) return { success: false, message: 'Capturing Disabled' };
    if (isCapturing) return { success: false, message: 'Already capturing' };

    try {
      const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
      const entireScreen = sources.find(source => source.name === 'Entire screen');

      const constraints:any = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: entireScreen.id,
            width: { ideal: window.screen.width },
            height: { ideal: window.screen.height }
          }
        }
      };
    
      // Create a Stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
      // Create the Media Recorder
      const options = { mimeType: 'video/webm; codecs=vp9' };
      mediaRecorder = new MediaRecorder(stream, options);
    
      // Register Event Handlers
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;

      if (entireScreen) {
        isCapturing = true;
        mainWindow.webContents.send('capture-status', true);
        return { success: true, sourceId: entireScreen.id };
      } else {
        return { success: false, message: 'Unable to find screen source' };
      }
    } catch (error) {
      console.error('Failed to start screen capture:', error);
      mainWindow.webContents.send('capture-error', error.message);
      return { success: false, message: error };
    }
  });

  // Handle stop screen capture request
  ipcMain.handle('stop-screen-capture', async () => {
    if (!isCapturing) return { success: false, message: 'Not capturing' };
    mediaRecorder.stop();
    isCapturing = false;
    mainWindow.webContents.send('capture-status', false);
    return { success: true };
  });

  // ipcMain.handle('enable-screen-capture',()=>{
  //   isCapturingEnabled = true;
  // })

  // ipcMain.handle('disable-screen-capture',()=>{
  //   isCapturingEnabled = false
  // })
})()

app.on('window-all-closed', () => {
  app.quit()
})