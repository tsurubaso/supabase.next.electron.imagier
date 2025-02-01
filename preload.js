const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("electron", {
  readFile: (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        console.log("Preload script loaded!"); ////////////////////////
        console.log("Preload path:", path.join(__dirname, 'preload.js')); ////////////////////////
        if (err) reject(err);
        else resolve(data);
      });
    });
  },
});
