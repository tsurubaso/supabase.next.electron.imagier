console.log("Using it baby!!!whOUUUUU");
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: (relativePath) => ipcRenderer.send('open-file', relativePath),
});


