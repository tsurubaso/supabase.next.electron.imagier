const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const grayMatter = require("gray-matter");
const sqlite3 = require("sqlite3").verbose();
const fsp = require("fs").promises;

function createWindow() {
  const preloadPath = path.join(__dirname, "preload.js");

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath, //
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
    },
  });
  console.log("window created\n");

  // win.setMenuBarVisibility(false);///////////////////////just for now
  //  win.setAutoHideMenuBar(true);///////////////////////just for now

  win.loadURL("http://localhost:3000");

  win.webContents.on("did-fail-load", () => {
    console.log("Failed to load content\n");
  });

  win.on("closed", () => {
    console.log("Window closed\n");
  });

  // Database setup
  setupDatabase();
  console.log("Setup Database\n");
}

app.whenReady().then(() => {
  console.log("App is ready\n");

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("open-file", (event, relativePath) => {
  const libreOfficePath = "C:/Program Files/LibreOffice/program/soffice.exe"; // Adjust the path if necessary
  const absolutePath = path.join(__dirname, relativePath); // Convert to absolute path
  exec(`"${libreOfficePath}" "${absolutePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      return;
    }
    console.log(`File opened successfully: ${stdout}`);
  });
});

ipcMain.on("compare-file", (event, relativePath) => {
  //const vscodePath = "C:/Program Files/Microsoft VS Code/bin/code"; // Adjust if needed
  const absolutePath = path.join(__dirname, relativePath); // Convert to absolute path

  exec(`code --diff "${absolutePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      return;
    }
    console.log(`File opened successfully in VS Code: ${stdout}`);
  });
});



// This will listen for the "get-books" event from the renderer process
ipcMain.handle("get-books", async () => {
  // Path to your SQLite database
  const dbPath = path.join(__dirname, "books.db");

  // Open the SQLite database
  const db = new sqlite3.Database(dbPath);

  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows); // Return the rows (books)
      }
    });

    db.close();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  console.log("App is quitting\n");
});

function setupDatabase() {
  // Path to the books folder
  const booksFolder = path.join(__dirname, "public", "books");

  // Open SQLite database
  let db = new sqlite3.Database("./books.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the SQLite database.");
  });

  // Drop the existing table if it exists
  db.run(`DROP TABLE IF EXISTS books`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Dropped the existing books table.");

    // Create a new table
    db.run(
      `CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    illu_author TEXT,
    text_author TEXT,
    title TEXT,
    type TEXT,
    description TEXT,
    status TEXT,
    link TEXT,
    lecture INTEGER
        )`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("Created the books table.");

        // Read files from the books folder and insert data
        insertBooksData(db, booksFolder);
      }
    );
  });
}

async function insertBooksData(db, booksFolder) {
  try {
    const files = await fsp.readdir(booksFolder);

    // Process all files in parallel
    const insertPromises = files
      .filter((file) => file !== ".git") // Ignore .git
      .map(async (file) => {
        try {
          const filePath = path.join(booksFolder, file);
          const fileContents = await fsp.readFile(filePath, "utf8");

          // Extract filename without extension
          const filename = path.parse(file).name;

          // Parse front matter
          const { data } = grayMatter(fileContents);

          // Ensure data contains required fields
          if (!data.text_author || !data.title) {
            console.error(`Missing required data in file: ${file}`);
            return;
          }

          // Insert into SQLite using a Promise
          return new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO books (illu_author, text_author, title, type, description, status, link, lecture) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                data.illu_author || null,
                data.text_author,
                data.title,
                data.type || null,
                data.description || null,
                data.status || null,
                data.link || null,
                data.lecture || 0,
              ],
              (err) => {
                if (err) {
                  console.error(`Error inserting ${file}:`, err.message);
                  reject(err);
                } else {
                  console.log(`Inserted ${data.title} into the database.`);
                  resolve();
                }
              }
            );
          });
        } catch (fileError) {
          console.error(`Error processing file ${file}:`, fileError);
        }
      });

    // Wait for all insertions to finish
    await Promise.all(insertPromises);

    console.log("All files have been processed.");
  } catch (err) {
    console.error("Error reading files:", err);
  } finally {
    // Close the database connection
    db.close((err) => {
      if (err) console.error(err.message);
      else console.log("Database connection closed.");
    });
  }
}
