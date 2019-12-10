const { app, BrowserWindow,Menu,ipcMain} = require("electron");
let mainWindow;
const template = [
  {
      label: 'Object',
      submenu: [
          {
              label: 'Load',
              click () { mainWindow.webContents.send("load_files",["test"]); }
          },
          {
              label: 'Clear',
              click () { mainWindow.webContents.send("clear_objects");}
          }
      ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 840,
    height: 600
  });
  mainWindow.loadFile("loader_test.html");
  //  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
