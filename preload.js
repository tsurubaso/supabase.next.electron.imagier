console.log("Using preload.js");
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: (relativePath) => ipcRenderer.send('open-file', relativePath),
  compareFile: (relativePath) => ipcRenderer.send('compare-file', relativePath),
  
});


