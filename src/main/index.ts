import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    maxWidth: 900,
    maxHeight: 700,
    title: 'PDF Manipulator',
    webPreferences: { nodeIntegration: true },
  });
  Menu.setApplicationMenu(null); // Removes menu bar (File, Edit, View)

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window
      .loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
      .then(
        () => {},
        () => {}
      );
  } else {
    window
      .loadURL(
        formatUrl({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true,
        })
      )
      .then(
        () => {},
        () => {}
      );
  }

  window.on('will-resize', (e) => {
    e.preventDefault();
  });

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
