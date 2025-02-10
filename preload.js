console.log("Using preload.js");
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: (relativePath) => ipcRenderer.send('open-file', relativePath), // open Libre Office
  compareFile: (relativePath) => ipcRenderer.send('compare-file', relativePath), // open Visual Code Studio
  getBooks: () => ipcRenderer.invoke("get-books"), // Invoke 'get-books' on the main process
 
  
});


