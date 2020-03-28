const { app, BrowserWindow,Menu,ipcMain} = require("electron");
const Store = require('electron-store');
const store = new Store();


let mainWindow;
//packaging
//electron-packager --overwrite ./src e_Simple3DView --platform=win32 --arch=x64 --electron-version=5.0.6
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
    width: store.get('window.width', 800),
    height: store.get('window.height', 600),
  });
  mainWindow.loadFile("src/loader_test.html");
  // mainWindow.webContents.openDevTools();
  mainWindow.on("close", () => {
    let bb = mainWindow.getBounds();
    store.set({
      "window.x": bb["x"],
      "window.y": bb["y"],
      "window.width": bb["width"],
      "window.height": bb["height"],

    });
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  if(store.has("window.x") && store.has("window.y")){
    mainWindow.setPosition(store.get("window.x",0),store.get("window.y",0));
  }


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