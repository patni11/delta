import path from 'path'
import { app, BrowserWindow, screen } from 'electron'
import serve from 'electron-serve'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

(async () => {
  await app.whenReady()

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
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
})()

app.on('window-all-closed', () => {
  app.quit()
})