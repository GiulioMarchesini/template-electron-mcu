const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    //backend to frontend
    portUsed: (callback) => ipcRenderer.on('Port', callback),
    getVal: (callback) => ipcRenderer.on('BackToFront', callback),
    //frontend to backend
    sendVal: (val) => ipcRenderer.send('FrontToBack', val)
})