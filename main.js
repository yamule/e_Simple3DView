const { app, BrowserWindow,Menu,ipcMain} = require("electron");
const Store = require('electron-store');
const store = new Store();
const dialog = require('electron').dialog;
const fs = require('fs');
const path = require('path');
let mainWindow;
//packaging
//electron-packager --overwrite ./src e_Simple3DView --platform=win32 --arch=x64 --electron-version=5.0.6


function sendFilePaths(filePaths_){
  let mtl = null;
  let obj = null;
  let stl = null;
  let filepaths = [];
  for(let tii = 0;tii < filePaths_.length;tii++){
    if(filePaths_[tii].match(/[;,]/)){
      console.log("; , are not allowed as file path. \n"+filelist[tii]);
      continue;
    }
    let mmat = filePaths_[tii].match(/\.([^.]+)$/);
    if(mmat){
      let ext = mmat[1].toLowerCase();
      if(ext === "obj"){
        obj = filePaths_[tii];
        filepaths.push(obj);
      }else if (ext === "mtl"){
        mtl = filePaths_[tii];
        filepaths.push(mtl);
      }else if(ext === "stl"){
        stl = filePaths_[tii];
        filepaths.push(stl);
      }else{
        console.log("Unrecognized extension : "+ext);
      }
    }
  }

  if(obj != null && mtl == null){
    mtl = getMTLPath(obj);
    if(mtl.length == 0){
      mtl = null;
    }else{
      if(!path.isAbsolute(mtl)){
        let mbasedir = path.dirname(obj);
        mtl = mbasedir+"/"+mtl;
        filepaths.push(mtl);
      }
    }
    console.log(mtl);
  }

  mainWindow.webContents.send("loadFiles",filepaths);
}
const template = [
  {
    label: 'Object',
    submenu: [
        {
            label: 'Load',
            click () {  
              dialog.showOpenDialog(null, {
                properties: ['openFile','multiSelections'],
                title: 'Load 3D object',
                defaultPath: '.',
                filters: [
                  {name: 'obj,mtl,stl', extensions: ['obj','mtl','stl']}
                ]
              }).then(selectedfiles => {
                console.log(selectedfiles);
              if(!selectedfiles.canceled){
                sendFilePaths(selectedfiles.filePaths);
              }else{
                //console.log("none");
              }
            });
          }
        },
        {
            label: 'Clear',
            click () {
              mainWindow.webContents.send("clearAllModels");
            }
        }
    ]
},{
  label: 'Help',
  submenu: [
      {
          label: 'DevTools',
          click () { 
            mainWindow.webContents.openDevTools();
          }
      }
  ]
},
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: store.get('window.width', 800),
    height: store.get('window.height', 600),
    
  });
  mainWindow.loadFile("src/loader_test.html");
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

function getMTLPath(objfile){
	let data = fs.readFileSync(objfile, 'utf8').toString().split(/[\r\n]+/);
	for(let ii = 0;ii < data.length;ii++){
    let mmat = data[ii].match(/mtllib[\s]+(.+)$/);
		if(mmat){
			let mbasedir = path.dirname(objfile);
			return mmat[1];
		}
	}
	return "";
}

function resourceIsAbsolute(mtlfile){
	let data = fs.readFileSync(mtlfile, 'utf8').toString().split(/[\r\n]+/);
	for(let ii = 0;ii < data.length;ii++){
    let mmat = data[ii].match(/map_[^\s]+[\s]+(.+)$/)
		if(mmat){
			let fname = mmat[1];
			if(path.isAbsolute(fname)){
				return true;
			}else{
				return false;
			}
		}
	}
	return false;
}

ipcMain.on(
  "fileDropped",(event,files)=>{sendFilePaths(files);}
);