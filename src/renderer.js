const { webUtils,ipcRenderer  } = require('electron');
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    let filepathlist = [];
    for(let ii = 0;ii < e.dataTransfer.files.length;ii++){
        filepathlist.push(webUtils.getPathForFile(e.dataTransfer.files[ii]));
    }
    //console.log(filepathlist);
    ipcRenderer.send("fileDropped",filepathlist);
});

ipcRenderer.on("loadFiles",(e,files) => {loadFiles(files);});
ipcRenderer.on("clearAllModels",()=>{processCommand("func:clear_all_models;");});
