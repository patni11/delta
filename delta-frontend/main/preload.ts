import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  startScreenCapture: () => ipcRenderer.invoke('start-screen-capture'),
  stopScreenCapture: () => ipcRenderer.invoke('stop-screen-capture'),
  onCaptureStatus: (callback) => ipcRenderer.on('capture-status', callback),
  onCaptureError: (callback) => ipcRenderer.on('capture-error', callback),
  //enableScreenCapture: () => ipcRenderer.invoke('enable-screen-capture'),
  //disableScreenCapture: () => ipcRenderer.invoke('disable-screen-capture'),
});

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
