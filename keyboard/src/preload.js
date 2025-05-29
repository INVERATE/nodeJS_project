const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    envoyerMessage: (msg) => ipcRenderer.send('mon-message', msg),
    recevoirReponse: (callback) => ipcRenderer.on('reponse-message', (event, data) => callback(data))
});
