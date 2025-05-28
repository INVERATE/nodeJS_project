// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    envoyerMessage: (message) => ipcRenderer.send("mon-message", message),
    recevoirReponse: (callback) => ipcRenderer.on("reponse-message", (event, data) => callback(data))
});
