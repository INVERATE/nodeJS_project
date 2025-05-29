console.log("Preload.js démarre !");

const { contextBridge, ipcRenderer } = require("electron");
//const R = require("ramda");

let R;
try {
    R = require("ramda");
    console.log("✅ Ramda chargé dans preload.js !", R);
} catch (err) {
    console.error("❌ Erreur en chargeant Ramda :", err);
}
console.log("Valeur de R avant expose:", R);

contextBridge.exposeInMainWorld("R", R);
console.log("preload.js est bien exécuté !");


contextBridge.exposeInMainWorld("electronAPI", {
    envoyerMessage: (message) => ipcRenderer.send("mon-message", message),
    recevoirReponse: (callback) => ipcRenderer.on("reponse-message", (event, data) => callback(data))
});
